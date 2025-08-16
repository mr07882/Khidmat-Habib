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

// Form APIs
export { 
  submitNominationForm, 
  getNominationForm, 
  getAllNominationForms, 
  updateNominationStatus,
  submitNominationWithdrawalForm,
  getNominationWithdrawalForm,
  getAllNominationWithdrawalForms,
  updateNominationWithdrawalStatus,
  submitCandidateRetirementForm,
  getCandidateRetirementForm,
  getAllCandidateRetirementForms,
  updateCandidateRetirementStatus,
  submitFamilyParticipationForm,
  getFamilyParticipationForm,
  getAllFamilyParticipationForms,
  updateFamilyParticipationStatus,
  submitEducationDonationBoxForm,
  getEducationDonationBoxForm,
  getAllEducationDonationBoxForms,
  updateEducationDonationBoxStatus,
  submitHallBookingForm,
  getHallBookingForm,
  getAllHallBookingForms,
  updateHallBookingStatus,
  submitBusBookingForm,
  getBusBookingForm,
  getAllBusBookingForms,
  updateBusBookingStatus,
  submitDeathInfoForm,
  getDeathInfoForm,
  getAllDeathInfoForms,
  updateDeathInfoStatus,
  submitForm,
  getForm,
  submitTakhtiRequestForm,
  getTakhtiRequestForm,
  getAllTakhtiRequestForms,
  updateTakhtiRequestStatus,
  submitWadiEZainabForm,
  submitGraveRepairForm,
  submitDuplicateCardForm 
} from './FormAPI';

// Cloudinary Service (for backward compatibility)
export { 
  uploadImageToCloudinary, 
  uploadDocumentToCloudinary, 
  uploadMultipleFiles,
  deleteFileFromCloudinary,
  getFileInfo
} from './CloudinaryService';

// Firebase Storage Service (recommended for forms)
export {
  uploadImageToFirebaseStorage,
  uploadDocumentToFirebaseStorage,
  uploadMultipleFilesToFirebaseStorage,
  deleteFileFromFirebaseStorage,
  getFileInfoFromFirebaseStorage
} from './FirebaseStorageService';

// Form Validation
export { 
  validateNominationForm, 
  validateNominationWithdrawalForm,
  validateCandidateRetirementForm,
  validateFamilyParticipationForm,
  validateEducationDonationBoxForm,
  validateHallBookingForm,
  validateBusBookingForm,
  validateDeathInfoForm,
  validateEmail, 
  validatePhone, 
  validateRequired, 
  validateDate,
  validateFileUpload,
  sanitizeFormData
} from './FormValidation';

// Utility Functions
export { 
  searchMembersByField, 
  getAllMembers, 
  transformMemberData, 
  validateJCIC, 
  sanitizeMemberData 
} from './utils';



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
