# Firebase Authentication System

This directory contains the Firebase-based authentication system for the KPSIAJ application, replacing the previous MongoDB implementation.

## Overview

The new authentication system uses Firebase Realtime Database to store member information and handle user authentication. All authentication flows (signup, login, password reset) now work directly with Firebase.

## File Structure

- `MemberInformation.js` - APIs for fetching member data from Firebase
- `auth.js` - Core authentication functions (OTP, password hashing, etc.)
- `emailService.js` - Email service for sending OTPs
- `utils.js` - Utility functions for Firebase operations
- `index.js` - Main export file for all Firebase APIs

## Key Features

### 1. Member Information API
- `getMemberByJCIC(jcic)` - Fetch member details by JCIC number
- `checkMemberSignupStatus(jcic)` - Check if member exists and has password

### 2. Authentication Functions
- `generateOTP()` - Generate 6-digit OTP
- `hashPassword(password)` - Hash password using bcrypt
- `comparePassword(password, hash)` - Compare password with hash
- `storeOTP(jcic, otp)` - Store OTP in Firebase with expiry
- `verifyOTP(jcic, otp)` - Verify OTP and remove after use
- `updateMemberPassword(jcic, hashedPassword)` - Update member password

### 3. Email Service
- `sendOTPEmail(email, otp)` - Send OTP via email
- `sendOTPSMS(phoneNumber, otp)` - Send OTP via SMS (placeholder)

## Authentication Flow

### Signup Process
1. User enters JCIC number and password
2. System validates JCIC exists in Firebase Members collection
3. System checks if user already has password (already signed up)
4. If new user, generate OTP and send to registered email
5. User enters OTP for verification
6. If OTP correct, hash password and store in Firebase
7. Redirect to home screen

### Login Process
1. User enters JCIC number and password
2. System validates JCIC exists in Firebase
3. System checks if user has password (is signed up)
4. If signed up, compare entered password with stored hash
5. If password matches, login successful
6. Redirect to home screen

### Password Reset Process
1. User enters JCIC number
2. System validates JCIC exists and user is signed up
3. Generate OTP and send to registered email
4. User enters OTP and new password
5. If OTP correct, hash new password and update Firebase
6. Redirect to login screen

## Firebase Database Structure

```
Firebase Database:
├── Members/
│   ├── 3333444455556666/
│   │   ├── Age: 23
│   │   ├── BloodGroup: "O +ve"
│   │   ├── CNIC: "4230197703418"
│   │   ├── Country: "Pakistan"
│   │   ├── DOB: "Fri Jul 14 2002 16:01:00 GMT+0500"
│   │   ├── Email: "mannan.mohammed14@gmail.com"
│   │   ├── Father_Husband: "Mohammad"
│   │   ├── IslamicDOB: "Dhu Al Qaadah 16, 1200"
│   │   ├── Name: "Mannan"
│   │   ├── Picture: "https://..."
│   │   ├── Surname: "Rangoonia"
│   │   └── Password: "hashed_password_here" (only if signed up)
│   └── 4444555566667777/
│       └── ... (similar structure)
└── OTPs/
    ├── 3333444455556666/
    │   ├── otp: "123456"
    │   ├── createdAt: 1234567890
    │   └── expiresAt: 1234567890
    └── ... (temporary OTP storage)
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- OTPs expire after 5 minutes
- OTPs are automatically removed after successful verification
- Sensitive data (passwords) are not exposed to client
- JCIC validation ensures only valid members can authenticate

## Usage Examples

```javascript
import { 
  getMemberByJCIC, 
  checkMemberSignupStatus,
  generateOTP,
  hashPassword,
  comparePassword 
} from '../Api/Firebase';

// Get member information
const member = await getMemberByJCIC('3333444455556666');

// Check signup status
const status = await checkMemberSignupStatus('3333444455556666');

// Hash password
const hashedPassword = await hashPassword('myPassword123');

// Compare password
const isValid = await comparePassword('myPassword123', hashedPassword);
```

## Migration Notes

- All MongoDB dependencies have been removed
- Authentication now works directly with Firebase
- OTP system is now Firebase-based instead of backend-based
- Password storage format has changed to bcrypt hashes
- Member data structure matches Firebase schema

## Future Enhancements

- Integrate with actual email service (SendGrid, AWS SES)
- Add SMS OTP support via Twilio
- Implement rate limiting for OTP requests
- Add biometric authentication support
- Implement session management and JWT tokens 