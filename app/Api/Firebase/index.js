import { db } from '../../Config/firebase';
import { ref, set, get, child, update } from 'firebase/database';

// Member Information APIs
export { getMemberByJCIC, checkMemberSignupStatus } from './MemberInformation';

// Authentication APIs
export { 
  generateOTP, 
  hashPassword, 
  comparePassword, 
  storeOTP, 
  verifyOTP, 
  updateMemberPassword, 
  cleanupExpiredOTPs 
} from './auth';

// Email Service
export { sendOTPEmail, sendOTPSMS } from './emailService';

// Utility Functions
export { 
  searchMembersByField, 
  getAllMembers, 
  transformMemberData, 
  validateJCIC, 
  sanitizeMemberData 
} from './utils';

// Test Functions (for development/testing)
export { testFirebaseAuth, testMemberInfo } from './test';

// Legacy functions (keeping for backward compatibility)
// Write data example
export const writeUserData = async (userId, data) => {
  await set(ref(db, 'userData/' + userId), data);
};

// Read data example
export const readUserData = async (userId) => {
  const snapshot = await get(child(ref(db), 'userData/' + userId));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};
