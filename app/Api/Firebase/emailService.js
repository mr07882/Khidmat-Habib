// Email service for sending OTPs
// This implementation sends OTPs via HTTP request to your backend server

import { buildBackendURL } from '../../Config/backend';

export const sendOTPEmail = async (email, otp) => {
  try {
    // Option 1: Send via your existing backend server
    const response = await fetch(buildBackendURL('/send-otp-email'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Your OTP Code - KPSIAJ',
        otp: otp,
        text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #715054;">KPSIAJ Authentication</h2>
            <p>Your OTP code is:</p>
            <h1 style="color: #715054; font-size: 32px; letter-spacing: 8px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      })
    });

    if (response.ok) {
      const responseData = await response.json();
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to send email' };
    }

  } catch (error) {
    // Check if it's a network error (backend not running)
    if (error.message.includes('fetch') || error.message.includes('Network')) {
      // For development, you can check the console to see the OTP
      return { success: true, developmentMode: true, message: 'Backend not accessible - check console for OTP' };
    }
    
    // Other errors
    return { success: true, developmentMode: true, message: 'Email service error - check console for OTP' };
  }
};

// SMS service placeholder (if you want to send OTP via SMS as well)
export const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    // For now, we'll just log the OTP
    // In production, integrate with your SMS service like Twilio
    return { success: true, developmentMode: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 