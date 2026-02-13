require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const { connectDB, sequelize } = require('./config/db');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const busboy = require('busboy');
// Import Models
const Property = require('./models/Property');
const Booking = require('./models/Booking');
const Admin = require('./models/Admin');
const fs = require('fs');


// ✅ Import Routes (Fixed)
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

// 1. DATABASE CONNECTION
connectDB(); 

// Define Relationships
Property.hasMany(Booking, { foreignKey: 'property_id' });
Booking.belongsTo(Property, { foreignKey: 'property_id' });

// Sync Tables
sequelize.sync()
  .then(() => console.log("✅ MySQL Database & Tables Synced!"))
  .catch(err => console.error("❌ Database Sync Error:", err));

// 2. MIDDLEWARE
  
app.use(cors({
    origin: [
        'http://localhost:5500',        // Your VS Code Live Server
        'http://127.0.0.1:5500',      // Alternative local address
        'https://777rishabh777.github.io', // If you use GitHub Pages
        'https://niftel-infra.onrender.com' // Your actual live frontend URL
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Session Configuration
const mySessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
    secret: 'niftel_secret_key_999',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,       
        httpOnly: true,      
        sameSite: 'lax',     
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
mySessionStore.sync();

// 3. API ROUTES
app.use('/api/admin', adminRoutes); // ✅ Main Admin & System User Routes

// Other API Routes
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/featured-locations", require("./routes/featuredLocationRoutes"));
app.use("/api/features", require("./routes/featureRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

// --- ⚠️ TEMPORARY RESET TOOL (Open in Browser) ---
app.get('/reset-super-admin', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        // 1. Wipe current broken admins
        await Admin.destroy({ where: {}, truncate: true });

        // 2. Create the Super Admin correctly
        const hashedPassword = await bcrypt.hash('admin1', 10);
        
        await Admin.create({
            fullName: "Niftel Owner",
            email: "info@niftelinfra.com",
            password: hashedPassword,
            role: "super_admin"
        });

        res.send(`
            <h1 style="color:green">✅ Success!</h1>
            <p><strong>User:</strong> info@niftelinfra.com</p>
            <p><strong>Password:</strong> admin1</p>
            <br>
            <a href="/admin.html">Go to Login</a>
        `);
    } catch (err) {
        res.send("Error: " + err.message);
    }
});

// 4. STATIC FILES & PAGES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, "public")));

// Page Handlers
app.get('/blog-detail/:slug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog-detail.html')));
app.get('/property/:slug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'property.html')));

// HTML Extension Middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.includes('.')) return next();
  const htmlPath = path.join(__dirname, 'public', req.path + '.html');
  const fs = require('fs');
  if (fs.existsSync(htmlPath)) return res.sendFile(htmlPath);
  next();
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});
const PORT = process.env.PORT || 3000;



// --- Centralized Error Logging Middleware ---
app.use((err, req, res, next) => {
    const logFilePath = path.join(__dirname, 'error.log');
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ${req.method} ${req.url} - Error: ${err.message}\nStack: ${err.stack}\n\n`;

    // 1. Write the error to a local file named 'error.log'
    fs.appendFile(logFilePath, errorMessage, (fsErr) => {
        if (fsErr) console.error("❌ Failed to write to log file:", fsErr);
    });

    // 2. Still show the error in the console for Render/Localhost debugging
    console.error("❌ Server Error logged to file:", err.message);

    // 3. Send a clean response to the user
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error_type: err.name
    });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));