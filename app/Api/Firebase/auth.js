import { db } from '../../Config/firebase';
import { ref, set, update, get } from 'firebase/database';
import bcrypt from 'react-native-bcrypt';

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash password using bcrypt
export const hashPassword = async (password) => {
  try {
    const salt = bcrypt.genSaltSync(10); // 10 rounds is a good balance between security & performance
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

// Compare password with bcrypt hash
export const comparePassword = async (password, hash) => {
  try {
    return bcrypt.compareSync(password, hash);
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

      if (now > otpData.expiresAt) {
        return { success: false, error: 'OTP expired' };
      }

      if (otpData.otp === otp) {
        await set(otpRef, null); // remove OTP after successful verification
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
