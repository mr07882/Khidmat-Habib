
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Email setup for OTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your.email@gmail.com',
    pass: process.env.EMAIL_PASS || 'yourpassword',
  },
});

// Endpoint for sending OTP emails
app.post('/send-otp-email', async (req, res) => {
  try {
    const { to, otp } = req.body;
    if (!to || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your.email@gmail.com',
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #715054;">KPSIAJ Authentication</h2><p>Your OTP code is:</p><h1 style="color: #715054; font-size: 32px; letter-spacing: 8px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">${otp}</h1><p>This code will expire in 5 minutes.</p><p>If you didn't request this code, please ignore this email.</p></div>`
    };
    const result = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: result.messageId, message: 'OTP email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    res.status(500).json({ error: 'Failed to send OTP email', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
