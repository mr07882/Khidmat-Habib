import { db } from '../../Config/firebase';
import { ref, set, update, get } from 'firebase/database';

/*
 * NOTE: This is a temporary password hashing solution for development/testing.
 * 
 * For production, you should implement a more secure password hashing method:
 * 
 * Option 1: Use crypto-js (more reliable than react-native-bcrypt)
 * npm install crypto-js
 * import CryptoJS from 'crypto-js';
 * 
 * const hashPassword = (password) => {
 *   const salt = CryptoJS.lib.WordArray.random(128/8);
 *   const hash = CryptoJS.PBKDF2(password, salt, { keySize: 256/32 });
 *   return salt.toString() + hash.toString();
 * };
 * 
 * Option 2: Use a backend service for password hashing
 * Send password to your backend, hash it there, and store the hash
 * 
 * Option 3: Use a different React Native compatible library
 * npm install react-native-crypto
 */

// Simple password hashing function (for development/testing)
// In production, you should use a more secure method
const simpleHash = (password) => {
  let hash = 0;
  if (password.length === 0) return hash.toString();
  
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Add some salt and make it longer
  const salt = 'KPSIAJ_2024_';
  return salt + Math.abs(hash).toString(16) + '_' + password.length;
};

// Simple password comparison
const simpleCompare = (password, hash) => {
  const computedHash = simpleHash(password);
  return computedHash === hash;
};

// Generate OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

// Hash password using simple hashing (temporary solution)
export const hashPassword = async (password) => {
  try {
    // Use simple hashing for now
    const hash = simpleHash(password);
    return hash;
  } catch (error) {
    throw error;
  }
};

// Compare password with hash
export const comparePassword = async (password, hash) => {
  try {
    const result = simpleCompare(password, hash);
    return result;
  } catch (error) {
    throw error;
  }
};

// Store OTP in Firebase (temporary storage)
export const storeOTP = async (jcic, otp) => {
  try {
    const otpRef = ref(db, `OTPs/${jcic}`);
    const otpData = {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes expiry
    };
    
    await set(otpRef, otpData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verify OTP from Firebase
export const verifyOTP = async (jcic, otp) => {
  try {
    const otpRef = ref(db, `OTPs/${jcic}`);
    const snapshot = await get(otpRef);
    
    if (snapshot.exists()) {
      const otpData = snapshot.val();
      
      const now = Date.now();
      
      // Check if OTP is expired
      if (now > otpData.expiresAt) {
        return { success: false, error: 'OTP expired' };
      }
      
      // Check if OTP matches
      if (otpData.otp === otp) {
        // Remove OTP after successful verification
        await set(otpRef, null);
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect OTP' };
      }
    } else {
      return { success: false, error: 'OTP not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update member password in Firebase
export const updateMemberPassword = async (jcic, hashedPassword) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    
    const updateData = { Password: hashedPassword };
    
    await update(memberRef, updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clean up expired OTPs (can be called periodically)
export const cleanupExpiredOTPs = async () => {
  try {
    const otpsRef = ref(db, 'OTPs');
    const snapshot = await get(otpsRef);
    
    if (snapshot.exists()) {
      const otps = snapshot.val();
      const now = Date.now();
      let cleanedCount = 0;
      
      for (const jcic in otps) {
        if (otps[jcic] && otps[jcic].expiresAt && now > otps[jcic].expiresAt) {
          await set(ref(db, `OTPs/${jcic}`), null);
          cleanedCount++;
        }
      }
      
      return { success: true, cleanedCount };
    }
    
    return { success: true, cleanedCount: 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 