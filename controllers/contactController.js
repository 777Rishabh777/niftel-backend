const Contact = require("../models/contact"); 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

exports.submitContact = async (req, res) => {
  console.log('📝 submitContact called');
  try {
    const { name, email, phone, subject, message, propertyId, propertyName, service } = req.body;
    console.log("Request body:", req.body);

    const newContact = await Contact.create({ 
        name, 
        email, 
        phone, 
        subject, 
        message, 
        propertyId, 
        propertyName, 
        service 
    });
    
    console.log('✅ Contact saved, ID:', newContact.id);

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@niftel.com',
        to: email,
        subject: `Thank you for contacting us - ${subject || 'Your Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank You for Contacting Niftel!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you shortly.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Message Details:</h3>
              <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
              <p><strong>Message:</strong> ${message}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${propertyName ? `<p><strong>Property:</strong> ${propertyName}</p>` : ''}
            </div>
            <p>Our team will review your inquiry and respond within 24-48 hours.</p>
            <p style="margin-top: 30px;">Best regards,<br><strong>Niftel Team</strong></p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log('✅ Confirmation email sent to:', email);
    } catch (emailErr) {
      console.error('⚠️  Email send failed:', emailErr.message);
    }

    res.status(200).json({ success: true, message: "Message sent successfully! Check your email for confirmation." });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Fetch all contact messages
exports.getAllContacts = async (req, res) => {
  console.log('📞 getAllContacts called');
  try {
    const messages = await Contact.findAll({
        order: [['created_at', 'DESC']]
    });

    console.log('✅ Found contacts:', messages.length);
    res.json({ success: true, contacts: messages });
  } catch (err) {
    console.error('❌ Error in getAllContacts:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Delete contact message
exports.deleteContact = async (req, res) => {
  console.log('🗑️  deleteContact called for ID:', req.params.id);
  try {
    const deletedCount = await Contact.destroy({
        where: { id: req.params.id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    console.log('✅ Contact deleted:', req.params.id);
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting contact:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};