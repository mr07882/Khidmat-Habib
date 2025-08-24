import { db } from '../../Config/firebase';
import { ref, set, get, child, push } from 'firebase/database';

// Submit nomination form data to Firebase
export const submitNominationForm = async (jcic, formData) => {
  try {
    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;
    
    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under NominationForm collection
    const nominationRef = ref(db, `NominationForm/${jcic}`);
    await set(nominationRef, submissionData);

    return {
      success: true,
      message: 'Nomination form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit nomination form',
      details: error.message
    };
  }
};

// Get nomination form data for a specific member
export const getNominationForm = async (jcic) => {
  try {
    const nominationRef = ref(db, `NominationForm/${jcic}`);
    const snapshot = await get(nominationRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No nomination form found for this member'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch nomination form',
      details: error.message
    };
  }
};

// Get all nomination forms (for admin purposes)
export const getAllNominationForms = async () => {
  try {
    const nominationRef = ref(db, 'NominationForm');
    const snapshot = await get(nominationRef);
    
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({
        jcic,
        ...forms[jcic]
      }));
      
      return {
        success: true,
        data: formsArray
      };
    } else {
      return {
        success: true,
        data: []
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch nomination forms',
      details: error.message
    };
  }
};

// Update nomination form status (for admin purposes)
export const updateNominationStatus = async (jcic, status, adminNotes = '') => {
  try {
    const nominationRef = ref(db, `NominationForm/${jcic}`);
    const updateData = {
      status: status,
      adminNotes: adminNotes,
      updatedAt: new Date().toISOString(),
    };
    
    await set(nominationRef, updateData);
    
    return {
      success: true,
      message: 'Nomination status updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update nomination status',
      details: error.message
    };
  }
};

// Submit nomination withdrawal form data to Firebase
export const submitNominationWithdrawalForm = async (jcic, formData) => {
  try {
    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;
    
    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under NominationWithdrawalForm collection
    const withdrawalRef = ref(db, `NominationWithdrawalForm/${jcic}`);
    await set(withdrawalRef, submissionData);

    return {
      success: true,
      message: 'Nomination withdrawal form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit nomination withdrawal form',
      details: error.message
    };
  }
};

// Get nomination withdrawal form data for a specific member
export const getNominationWithdrawalForm = async (jcic) => {
  try {
    const withdrawalRef = ref(db, `NominationWithdrawalForm/${jcic}`);
    const snapshot = await get(withdrawalRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No nomination withdrawal form found for this member'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch nomination withdrawal form',
      details: error.message
    };
  }
};

// Get all nomination withdrawal forms (for admin purposes)
export const getAllNominationWithdrawalForms = async () => {
  try {
    const withdrawalRef = ref(db, 'NominationWithdrawalForm');
    const snapshot = await get(withdrawalRef);
    
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({
        jcic,
        ...forms[jcic]
      }));
      
      return {
        success: true,
        data: formsArray
      };
    } else {
      return {
        success: true,
        data: []
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch nomination withdrawal forms',
      details: error.message
    };
  }
};

// Update nomination withdrawal form status (for admin purposes)
export const updateNominationWithdrawalStatus = async (jcic, status, adminNotes = '') => {
  try {
    const withdrawalRef = ref(db, `NominationWithdrawalForm/${jcic}`);
    const updateData = {
      status: status,
      adminNotes: adminNotes,
      updatedAt: new Date().toISOString(),
    };
    
    await set(withdrawalRef, updateData);
    
    return {
      success: true,
      message: 'Nomination withdrawal status updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update nomination withdrawal status',
      details: error.message
    };
  }
};

// Submit candidate retirement form data to Firebase
export const submitCandidateRetirementForm = async (jcic, formData) => {
  try {
    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;
    
    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under CandidateRetirementForm collection
    const retirementRef = ref(db, `CandidateRetirementForm/${jcic}`);
    await set(retirementRef, submissionData);

    return {
      success: true,
      message: 'Candidate retirement form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit candidate retirement form',
      details: error.message
    };
  }
};

// Get candidate retirement form data for a specific member
export const getCandidateRetirementForm = async (jcic) => {
  try {
    const retirementRef = ref(db, `CandidateRetirementForm/${jcic}`);
    const snapshot = await get(retirementRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No candidate retirement form found for this member'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch candidate retirement form',
      details: error.message
    };
  }
};

// Get all candidate retirement forms (for admin purposes)
export const getAllCandidateRetirementForms = async () => {
  try {
    const retirementRef = ref(db, 'CandidateRetirementForm');
    const snapshot = await get(retirementRef);
    
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({
        jcic,
        ...forms[jcic]
      }));
      
      return {
        success: true,
        data: formsArray
      };
    } else {
      return {
        success: true,
        data: []
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch candidate retirement forms',
      details: error.message
    };
  }
};

// Update candidate retirement form status (for admin purposes)
export const updateCandidateRetirementStatus = async (jcic, status, adminNotes = '') => {
  try {
    const retirementRef = ref(db, `CandidateRetirementForm/${jcic}`);
    const updateData = {
      status: status,
      adminNotes: adminNotes,
      updatedAt: new Date().toISOString(),
    };
    
    await set(retirementRef, updateData);
    
    return {
      success: true,
      message: 'Candidate retirement status updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update candidate retirement status',
      details: error.message
    };
  }
};

// Submit family participation form data to Firebase
export const submitFamilyParticipationForm = async (jcic, formData) => {
  try {
    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;
    
    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under FamilyParticipationForm collection
    const participationRef = ref(db, `FamilyParticipationForm/${jcic}`);
    await set(participationRef, submissionData);

    return {
      success: true,
      message: 'Family participation form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit family participation form',
      details: error.message
    };
  }
};

// Get family participation form data for a specific member
export const getFamilyParticipationForm = async (jcic) => {
  try {
    const participationRef = ref(db, `FamilyParticipationForm/${jcic}`);
    const snapshot = await get(participationRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No family participation form found for this member'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch family participation form',
      details: error.message
    };
  }
};

// Get all family participation forms (for admin purposes)
export const getAllFamilyParticipationForms = async () => {
  try {
    const participationRef = ref(db, 'FamilyParticipationForm');
    const snapshot = await get(participationRef);
    
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({
        jcic,
        ...forms[jcic]
      }));
      
      return {
        success: true,
        data: formsArray
      };
    } else {
      return {
        success: true,
        data: []
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch family participation forms',
      details: error.message
    };
  }
};

// Update family participation form status (for admin purposes)
export const updateFamilyParticipationStatus = async (jcic, status, adminNotes = '') => {
  try {
    const participationRef = ref(db, `FamilyParticipationForm/${jcic}`);
    const updateData = {
      status: status,
      adminNotes: adminNotes,
      updatedAt: new Date().toISOString(),
    };
    
    await set(participationRef, updateData);
    
    return {
      success: true,
      message: 'Family participation status updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update family participation status',
      details: error.message
    };
  }
};

// Submit hall booking form data to Firebase
export const submitHallBookingForm = async (jcic, formData) => {
  try {
    validateHallBookingForm(formData);

    const submissionId = `${jcic}_${Date.now()}`;
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending',
      submissionId,
    };

    const formRef = ref(db, `HallBookingForm/${jcic}`);
    await set(formRef, submissionData);

    return { success: true, message: 'Hall booking submitted successfully', submissionId, data: submissionData };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to submit hall booking form', details: error.message };
  }
};

export const getHallBookingForm = async (jcic) => {
  try {
    const formRef = ref(db, `HallBookingForm/${jcic}`);
    const snapshot = await get(formRef);
    if (snapshot.exists()) return { success: true, data: snapshot.val() };
    return { success: false, error: 'No hall booking found for this member' };
  } catch (error) {
    return { success: false, error: 'Failed to fetch hall booking form', details: error.message };
  }
};

export const getAllHallBookingForms = async () => {
  try {
    const formRef = ref(db, 'HallBookingForm');
    const snapshot = await get(formRef);
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({ jcic, ...forms[jcic] }));
      return { success: true, data: formsArray };
    }
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch hall booking forms', details: error.message };
  }
};

export const updateHallBookingStatus = async (jcic, status, adminNotes = '') => {
  try {
    const formRef = ref(db, `HallBookingForm/${jcic}`);
    const updateData = { status, adminNotes, updatedAt: new Date().toISOString() };
    await set(formRef, updateData);
    return { success: true, message: 'Hall booking status updated successfully' };
  } catch (error) {
    return { success: false, error: 'Failed to update hall booking status', details: error.message };
  }
};

// Submit education donation box form data to Firebase
export const submitEducationDonationBoxForm = async (jcic, formData) => {
  try {
    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;
    
    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under EducationDonationBoxForm collection
    const donationBoxRef = ref(db, `EducationDonationBoxForm/${jcic}`);
    await set(donationBoxRef, submissionData);

    return {
      success: true,
      message: 'Education donation box form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit education donation box form',
      details: error.message
    };
  }
};

// Submit bus booking form data to Firebase
export const submitBusBookingForm = async (jcic, formData) => {
  try {
    const submissionId = `${jcic}_${Date.now()}`;
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending',
      submissionId,
    };
    const formRef = ref(db, `BusBookingForm/${jcic}`);
    await set(formRef, submissionData);
    return { success: true, message: 'Bus booking submitted successfully', submissionId, data: submissionData };
  } catch (error) {
    return { success: false, error: 'Failed to submit bus booking form', details: error.message };
  }
};

export const getBusBookingForm = async (jcic) => {
  try {
    const formRef = ref(db, `BusBookingForm/${jcic}`);
    const snapshot = await get(formRef);
    if (snapshot.exists()) return { success: true, data: snapshot.val() };
    return { success: false, error: 'No bus booking found for this member' };
  } catch (error) {
    return { success: false, error: 'Failed to fetch bus booking form', details: error.message };
  }
};

export const getAllBusBookingForms = async () => {
  try {
    const formRef = ref(db, 'BusBookingForm');
    const snapshot = await get(formRef);
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({ jcic, ...forms[jcic] }));
      return { success: true, data: formsArray };
    }
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch bus booking forms', details: error.message };
  }
};

export const updateBusBookingStatus = async (jcic, status, adminNotes = '') => {
  try {
    const formRef = ref(db, `BusBookingForm/${jcic}`);
    const updateData = { status, adminNotes, updatedAt: new Date().toISOString() };
    await set(formRef, updateData);
    return { success: true, message: 'Bus booking status updated successfully' };
  } catch (error) {
    return { success: false, error: 'Failed to update bus booking status', details: error.message };
  }
};

// Submit death information form data to Firebase
export const submitDeathInfoForm = async (jcic, formData) => {
  try {
    const submissionId = `${jcic}_${Date.now()}`;
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending',
      submissionId,
    };
    const formRef = ref(db, `DeathInfoForm/${jcic}`);
    await set(formRef, submissionData);
    return { success: true, message: 'Death information form submitted successfully', submissionId, data: submissionData };
  } catch (error) {
    return { success: false, error: 'Failed to submit death information form', details: error.message };
  }
};

export const getDeathInfoForm = async (jcic) => {
  try {
    const formRef = ref(db, `DeathInfoForm/${jcic}`);
    const snapshot = await get(formRef);
    if (snapshot.exists()) return { success: true, data: snapshot.val() };
    return { success: false, error: 'No death information form found for this member' };
  } catch (error) {
    return { success: false, error: 'Failed to fetch death information form', details: error.message };
  }
};

export const getAllDeathInfoForms = async () => {
  try {
    const formRef = ref(db, 'DeathInfoForm');
    const snapshot = await get(formRef);
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({ jcic, ...forms[jcic] }));
      return { success: true, data: formsArray };
    }
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch death information forms', details: error.message };
  }
};

export const updateDeathInfoStatus = async (jcic, status, adminNotes = '') => {
  try {
    const formRef = ref(db, `DeathInfoForm/${jcic}`);
    const updateData = { status, adminNotes, updatedAt: new Date().toISOString() };
    await set(formRef, updateData);
    return { success: true, message: 'Death information status updated successfully' };
  } catch (error) {
    return { success: false, error: 'Failed to update death information status', details: error.message };
  }
};

// Get education donation box form data for a specific member
export const getEducationDonationBoxForm = async (jcic) => {
  try {
    const donationBoxRef = ref(db, `EducationDonationBoxForm/${jcic}`);
    const snapshot = await get(donationBoxRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No education donation box form found for this member'
      };
    }
  } catch (error) {
    console.error('Error fetching education donation box form:', error);
    return {
      success: false,
      error: 'Failed to fetch education donation box form',
      details: error.message
    };
  }
};

// Get all education donation box forms (for admin purposes)
export const getAllEducationDonationBoxForms = async () => {
  try {
    const donationBoxRef = ref(db, 'EducationDonationBoxForm');
    const snapshot = await get(donationBoxRef);
    
    if (snapshot.exists()) {
      const forms = snapshot.val();
      const formsArray = Object.keys(forms).map(jcic => ({
        jcic,
        ...forms[jcic]
      }));
      
      return {
        success: true,
        data: formsArray
      };
    } else {
      return {
        success: true,
        data: []
      };
    }
  } catch (error) {
    console.error('Error fetching all education donation box forms:', error);
    return {
      success: false,
      error: 'Failed to fetch education donation box forms',
      details: error.message
    };
  }
};

// Update education donation box form status (for admin purposes)
export const updateEducationDonationBoxStatus = async (jcic, status, adminNotes = '') => {
  try {
    const donationBoxRef = ref(db, `EducationDonationBoxForm/${jcic}`);
    const updateData = {
      status: status,
      adminNotes: adminNotes,
      updatedAt: new Date().toISOString(),
    };
    
    await set(donationBoxRef, updateData);
    
    return {
      success: true,
      message: 'Education donation box status updated successfully'
    };
  } catch (error) {
    console.error('Error updating education donation box status:', error);
    return {
      success: false,
      error: 'Failed to update education donation box status',
      details: error.message
    };
  }
};

// Submit Takhti Request form data to Firebase
export const submitTakhtiRequestForm = async (jcic, formData) => {
  try {
    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;

    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under TakhtiRequestForm collection
    const takhtiRequestRef = ref(db, `TakhtiRequestForm/${jcic}`);
    await set(takhtiRequestRef, submissionData);

    return {
      success: true,
      message: 'Takhti Request form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit Takhti Request form',
      details: error.message
    };
  }
};

// Get Takhti Request form data for a specific member
export const getTakhtiRequestForm = async (jcic) => {
  try {
    const takhtiRequestRef = ref(db, `TakhtiRequestForm/${jcic}`);
    const snapshot = await get(takhtiRequestRef);

    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No Takhti Request form found for this member'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch Takhti Request form',
      details: error.message
    };
  }
};

// Generic form submission function for other forms
export const submitForm = async (formType, jcic, formData) => {
  try {
    const submissionId = `${jcic}_${Date.now()}`;
    
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending',
      submissionId: submissionId,
    };

    const formRef = ref(db, `${formType}/${jcic}`);
    await set(formRef, submissionData);

    return {
      success: true,
      message: `${formType} submitted successfully`,
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    console.error(`Error submitting ${formType}:`, error);
    return {
      success: false,
      error: `Failed to submit ${formType}`,
      details: error.message
    };
  }
};

// Get form data for any form type
export const getForm = async (formType, jcic) => {
  try {
    const formRef = ref(db, `${formType}/${jcic}`);
    const snapshot = await get(formRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: `No ${formType} found for this member`
      };
    }
  } catch (error) {
    console.error(`Error fetching ${formType}:`, error);
    return {
      success: false,
      error: `Failed to fetch ${formType}`,
      details: error.message
    };
  }
};

export const validateHallBookingForm = (formData) => {
  const {
    fullName,
    fatherName,
    surname,
    jcic,
    cnic,
    address,
    purpose,
    hall,
    bookingDate,
    timingFrom,
    timingTo,
  } = formData;

  if (!fullName || !fatherName || !surname || !jcic || !cnic || !address) {
    throw new Error('All applicant details are required.');
  }

  if (!purpose) {
    throw new Error('Purpose of booking is required.');
  }

  if (!hall) {
    throw new Error('Hall selection is required.');
  }

  if (!bookingDate || !timingFrom || !timingTo) {
    throw new Error('Booking date and timings are required.');
  }

  const fromTime = new Date(`1970-01-01T${timingFrom}`);
  const toTime = new Date(`1970-01-01T${timingTo}`);
  if (toTime <= fromTime) {
    throw new Error('Timing To must be later than Timing From.');
  }
};

// Submit WadiEZainab form data to Firebase
export const submitWadiEZainabForm = async (jcic, formData) => {
  try {
    const formRef = ref(db, `wadiEZainabForms/${jcic}`);
    await set(formRef, formData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Submit Grave Repair form data to Firebase
export const submitGraveRepairForm = async (jcic, formData) => {
  try {
    const formRef = ref(db, `graveRepairForms/${jcic}`);
    await set(formRef, formData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Submit DuplicateCard form data to Firebase
export const submitDuplicateCardForm = async (jcic, formData) => {
  try {
    // Validate form data (if validation function exists)
    if (typeof validateDuplicateCardForm === 'function') {
      validateDuplicateCardForm(formData);
    }

    // Create a unique submission ID with timestamp
    const submissionId = `${jcic}_${Date.now()}`;

    // Prepare the form data with metadata
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submittedBy: jcic,
      status: 'pending', // pending, approved, rejected
      submissionId: submissionId,
    };

    // Store in Firebase under duplicateCardForms collection
    const duplicateCardRef = ref(db, `duplicateCardForms/${jcic}`);
    await set(duplicateCardRef, submissionData);

    return {
      success: true,
      message: 'Duplicate Card form submitted successfully',
      submissionId: submissionId,
      data: submissionData
    };
  } catch (error) {
    console.error('Error submitting Duplicate Card form:', error);
    return {
      success: false,
      error: 'Failed to submit Duplicate Card form',
      details: error.message
    };
  }
};

// Submit FSC Form data to Firebase
export const submitFSCForm = async (jcic, formData) => {
  try {
    const response = await set(ref(db, `fscForms/${jcic}`), formData);
    return { success: true, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};