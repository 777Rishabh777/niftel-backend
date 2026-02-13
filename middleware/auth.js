const jwt = require('jsonwebtoken');

// 1. Check if User is Logged In (Verify Token)
exports.isAdmin = (req, res, next) => {
    // Get token from the "Authorization" header
    // Frontend sends it like: "Bearer <token_string>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
    }

    // Extract the actual token part
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using your Secret Key
        // ⚠️ THIS KEY MUST MATCH THE ONE IN adminController.js
        const decoded = jwt.verify(token, 'niftel_secret_key_999'); 
        
        // Attach the admin info (id, role) to the request so other routes can use it
        req.admin = decoded; 
        
        next(); // Move to the next function
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};

// 2. Check if User is Super Admin
exports.isSuperAdmin = (req, res, next) => {
    // We check req.admin because 'isAdmin' ran first and saved the user data there
    if (req.admin && req.admin.role === 'super_admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: "Access Denied: Super Admin Only" });
};