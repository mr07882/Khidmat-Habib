// Form validation utilities for nomination form

// Validate JCIC number format (16 digits)
export const validateJCIC = (jcic) => {
  if (!jcic) return { isValid: false, error: 'JCIC number is required' };
  if (!/^\d{16}$/.test(jcic)) {
    return { isValid: false, error: 'JCIC number must be exactly 16 digits' };
  }
  return { isValid: true };
};

// Validate email format
export const validateEmail = (email) => {
  if (!email) return { isValid: true }; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

// Validate phone number format
export const validatePhone = (phone) => {
  if (!phone) return { isValid: false, error: 'Phone number is required' };
  // Pakistani phone number format: 03XXXXXXXXX
  const phoneRegex = /^03\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid Pakistani phone number (03XXXXXXXXX)' };
  }
  return { isValid: true };
};

// Validate required text field
export const validateRequired = (value, fieldName) => {
  // Check if value is undefined, null, or empty string
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  // If value is a string, check if it's empty after trimming
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  // If value is an array, check if it's empty
  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

// Validate date format
export const validateDate = (date) => {
  if (!date) return { isValid: true }; // Date is optional
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, error: 'Please enter a valid date (YYYY-MM-DD)' };
  }
  return { isValid: true };
};

// Validate dropdown selection
export const validateDropDownSelection = (selectedValue) => {
  if (!selectedValue || selectedValue === "") {
    return {
      isValid: false,
      error: "Please select a valid option from the dropdown."
    };
  }
  return { isValid: true };
};

// Validate nomination form data
export const validateNominationForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Required fields validation
  const requiredFields = [
    { field: 'fullName', name: 'Full Name' },
    { field: 'fatherOrHusband', name: 'Father/Husband Name' },
    { field: 'surname', name: 'Surname' },
    { field: 'jcic', name: 'JCIC' },
    { field: 'contact', name: 'Contact Number' },
    { field: 'office', name: 'Office Applying For' },
    { field: 'membershipDate', name: 'Membership Date' },
    { field: 'dob', name: 'Date of Birth' },
    { field: 'proposerName', name: 'Proposer Name' },
    { field: 'proposerSurname', name: 'Proposer Surname' },
    { field: 'proposerJcic', name: 'Proposer JCIC' },
    { field: 'proposerContact', name: 'Proposer Contact' },
    { field: 'seconderName', name: 'Seconder Name' },
    { field: 'seconderSurname', name: 'Seconder Surname' },
    { field: 'seconderJcic', name: 'Seconder JCIC' },
    { field: 'seconderContact', name: 'Seconder Contact' },
    { field: 'ballotName', name: 'Ballot Name' },
    { field: 'photo', name: 'Photo Upload' },
  ];

  requiredFields.forEach(({ field, name }) => {
    const validation = validateRequired(formData[field], name);
    if (!validation.isValid) {
      errors.push(validation.error);
    }
  });

  // JCIC validation
  ['jcic', 'proposerJcic', 'seconderJcic'].forEach((field) => {
    const jcicValidation = validateJCIC(formData[field]);
    if (!jcicValidation.isValid) {
      errors.push(jcicValidation.error);
    }
  });

  // Phone number validation
  ['contact', 'proposerContact', 'seconderContact'].forEach((field) => {
    const phoneValidation = validatePhone(formData[field]);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error);
    }
  });

  // Email validation (optional)
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error);
    }
  }

  // Dropdown validation for office
  const officeValidation = validateDropDownSelection(formData.office);
  if (!officeValidation.isValid) {
    errors.push(officeValidation.error);
  }

  // Add more specific warnings if needed

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate family participation form data
export const validateFamilyParticipationForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Required fields validation
  const requiredFields = [
    { field: 'name', name: 'Your Name' },
    { field: 'relation', name: 'Family Member Name' },
    { field: 'relationship', name: 'Relationship with Family Member' },
    { field: 'jcic', name: 'JCIC' },
    { field: 'email', name: 'Email' },
    { field: 'cellNo', name: 'Cell Number' },
    { field: 'ptclNo', name: 'PTCL Number' },
    { field: 'amount', name: 'Amount Donated' },
    { field: 'frequency', name: 'Payment Frequency' },
    { field: 'mode', name: 'Payment Method' },
    { field: 'chequeName', name: 'Name as on Cheque' },
    { field: 'signature', name: 'Signature' },
    { field: 'address', name: 'Address' },
    { field: 'transactionSlip', name: 'Transaction Slip' },
  ];

  requiredFields.forEach(({ field, name }) => {
    const validation = validateRequired(formData[field], name);
    if (!validation.isValid) {
      errors.push(validation.error);
    }
  });

  // Email validation
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  // Phone number validation
  const phoneValidation = validatePhone(formData.cellNo);
  if (!phoneValidation.isValid) {
    errors.push(phoneValidation.error);
  }

  // Amount validation (should be numeric and positive)
  if (formData.amount) {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('Amount must be a positive number');
    }
  }

  // Payment frequency validation (should be selected)
  if (!formData.frequency || formData.frequency.length === 0) {
    errors.push('Please select a payment frequency');
  }

  // Payment mode validation (should be selected)
  if (!formData.mode || formData.mode.length === 0) {
    errors.push('Please select a payment method');
  }

  // Cheque name validation (if cheque payment selected)
  if (formData.mode && formData.mode.includes('cheque') && !formData.chequeName) {
    warnings.push('Cheque name is recommended when paying by cheque');
  }

  // Transaction slip validation (if online payment selected)
  if (formData.mode && formData.mode.includes('online') && !formData.transactionSlip) {
    errors.push('Transaction slip is required when paying online');
  }

  // PTCL number validation (optional but if provided, should be valid)
  if (formData.ptclNo && !/^\d+$/.test(formData.ptclNo)) {
    errors.push('PTCL number should contain only digits');
  }

  // Warnings for optional fields
  if (!formData.relationship) {
    warnings.push('Relationship with family member is recommended');
  }

  if (!formData.ptclNo) {
    warnings.push('PTCL number is recommended for contact');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate education donation box form data
export const validateEducationDonationBoxForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Required fields validation
  const requiredFields = [
    { field: 'name', name: 'Full Name' },
    { field: 'fatherOrHusband', name: 'Father/Husband Name' },
    { field: 'address', name: 'Address' },
    { field: 'cnic', name: 'CNIC Number' },
    { field: 'jcic', name: 'JCIC Number' },
    { field: 'email', name: 'Email Address' },
  ];

  requiredFields.forEach(({ field, name }) => {
    const validation = validateRequired(formData[field], name);
    if (!validation.isValid) {
      errors.push(validation.error);
    }
  });

  // Email validation
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  // CNIC validation (Pakistani format: XXXXX-XXXXXXX-X)
  if (formData.cnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.cnic)) {
      errors.push('CNIC must be in format: XXXXX-XXXXXXX-X');
    }
  }

  // JCIC validation
  const jcicValidation = validateJCIC(formData.jcic);
  if (!jcicValidation.isValid) {
    errors.push(jcicValidation.error);
  }

  // Date validation (if provided)
  if (formData.date) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(formData.date)) {
      errors.push('Date must be in format: DD-MM-YYYY');
    }
  }

  // Address validation (should be reasonable length)
  if (formData.address && formData.address.length < 10) {
    warnings.push('Please provide a complete address for delivery');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate hall booking form data
export const validateHallBookingForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Applicant details
  const applicantRequired = [
    { field: 'fullName', name: 'Full Name' },
    { field: 'fatherName', name: 'Father\'s Name' },
    { field: 'surname', name: 'Surname' },
    { field: 'jcic', name: 'JCIC Number' },
    { field: 'cnic', name: 'CNIC Number' },
    { field: 'address', name: 'Full Address' },
  ];

  applicantRequired.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // JCIC validation
  const jcicValidation = validateJCIC(formData.jcic);
  if (!jcicValidation.isValid) errors.push(jcicValidation.error);

  // CNIC validation (Pakistani format)
  if (formData.cnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.cnic)) {
      errors.push('CNIC must be in format: XXXXX-XXXXXXX-X');
    }
  }

  // Purpose validation
  const purposeValidation = validateRequired(formData.purpose, 'Purpose of Booking');
  if (!purposeValidation.isValid) errors.push(purposeValidation.error);
  if (formData.purpose === 'other') {
    const otherPurposeValidation = validateRequired(formData.otherPurposeDetail, 'Other Purpose Detail');
    if (!otherPurposeValidation.isValid) errors.push(otherPurposeValidation.error);
  }

  // Hall selection validation
  const hallValidation = validateRequired(formData.hall, 'Hall');
  if (!hallValidation.isValid) errors.push(hallValidation.error);
  if (formData.hall === 'fatimiyah') {
    const fatimiyahDetailValidation = validateRequired(formData.fatimiyahDetail, 'Fatimiyah Hall Detail');
    if (!fatimiyahDetailValidation.isValid) errors.push(fatimiyahDetailValidation.error);
  }
  if (formData.hall === 'other') {
    const otherHallValidation = validateRequired(formData.otherHallDetail, 'Other Hall Detail');
    if (!otherHallValidation.isValid) errors.push(otherHallValidation.error);
  }

  // Booking details
  const bookingFields = [
    { field: 'bookingDay', name: 'Booking Day' },
    { field: 'bookingDate', name: 'Booking Date' },
    { field: 'timingFrom', name: 'Timing From' },
    { field: 'timingTo', name: 'Timing To' },
    { field: 'totalHours', name: 'Total Hours' },
  ];
  bookingFields.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // Basic date format DD-MM-YYYY
  if (formData.bookingDate) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(formData.bookingDate)) {
      errors.push('Booking Date must be in format: DD-MM-YYYY');
    }
  }

  // Total hours numeric
  if (formData.totalHours && !/^\d+(\.\d+)?$/.test(formData.totalHours)) {
    errors.push('Total Hours must be numeric');
  }

  // Serving item validation
  const serveValidation = validateRequired(formData.serveItem, 'Serving Item');
  if (!serveValidation.isValid) errors.push(serveValidation.error);
  if (formData.serveItem === 'other') {
    const otherServeValidation = validateRequired(formData.otherServeDetail, 'Other Serving Detail');
    if (!otherServeValidation.isValid) errors.push(otherServeValidation.error);
  }

  // Attachments: All required
  if (!formData.jcicFileUrl) {
    errors.push('JCIC/CNIC scan is required');
  }
  if (!formData.requestLetterUrl) {
    errors.push('Request letter is required');
  }
  if (!formData.paymentReceiptUrl) {
    errors.push('Payment receipt is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate bus booking form data
export const validateBusBookingForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Applicant details
  const applicantRequired = [
    { field: 'fullName', name: 'Full Name' },
    { field: 'address', name: 'Address' },
    { field: 'membershipNumber', name: 'Membership Number' },
    { field: 'cellNo', name: 'Cell Number' },
  ];

  applicantRequired.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // JCIC validation (membership number should be JCIC format)
  const jcicValidation = validateJCIC(formData.membershipNumber);
  if (!jcicValidation.isValid) {
    errors.push('Membership Number must be a valid JCIC number (16 digits)');
  }

  // Phone number validation
  const phoneValidation = validatePhone(formData.cellNo);
  if (!phoneValidation.isValid) {
    errors.push(phoneValidation.error);
  }

  // Residence number validation (optional but if provided, should be valid)
  if (formData.resNo && !/^\d+$/.test(formData.resNo)) {
    errors.push('Residence number should contain only digits');
  }

  // Booking details
  const bookingRequired = [
    { field: 'dateOfBooking', name: 'Date of Booking' },
    { field: 'pickUpPoint', name: 'Pick Up Point' },
    { field: 'purpose', name: 'Purpose of Booking' },
    { field: 'bookingTime', name: 'Booking Time' },
    { field: 'timeOut', name: 'Time Out' },
    { field: 'totalHours', name: 'Total Hours' },
  ];

  bookingRequired.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // Date format validation (DD-MM-YYYY)
  if (formData.dateOfBooking) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(formData.dateOfBooking)) {
      errors.push('Date of Booking must be in format: DD-MM-YYYY');
    }
  }

  // Total hours numeric validation
  if (formData.totalHours && !/^\d+(\.\d+)?$/.test(formData.totalHours)) {
    errors.push('Total Hours must be numeric');
  }

  // Time format validation (basic check)
  if (formData.bookingTime && !/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)?$/.test(formData.bookingTime)) {
    warnings.push('Booking Time should be in format: HH:MM AM/PM');
  }

  if (formData.timeOut && !/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)?$/.test(formData.timeOut)) {
    warnings.push('Time Out should be in format: HH:MM AM/PM');
  }

  // Attachment validation - handled separately in form submission
  // if (!formData.jcicFileUrl) {
  //   errors.push('JCIC/CNIC copy is required');
  // }

  // Address length validation
  if (formData.address && formData.address.length < 10) {
    warnings.push('Please provide a complete address');
  }

  // Purpose length validation
  if (formData.purpose && formData.purpose.length < 10) {
    warnings.push('Please provide a detailed purpose for the booking');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate candidate retirement form data
export const validateCandidateRetirementForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Required fields validation
  const requiredFields = [
    { field: 'candidateName', name: 'Candidate Name' },
    { field: 'fatherOrHusband', name: 'Father/Husband Name' },
    { field: 'post', name: 'Post' },
    { field: 'serialNumber', name: 'Serial Number' },
    { field: 'jcic', name: 'JCIC/JID Number' },
    { field: 'signature', name: 'Signature' },
  ];

  requiredFields.forEach(({ field, name }) => {
    const validation = validateRequired(formData[field], name);
    if (!validation.isValid) {
      errors.push(validation.error);
    }
  });

  // JCIC validation
  const jcicValidation = validateJCIC(formData.jcic);
  if (!jcicValidation.isValid) {
    errors.push(jcicValidation.error);
  }

  // Serial number validation (should be numeric)
  if (formData.serialNumber && !/^\d+$/.test(formData.serialNumber)) {
    errors.push('Serial Number must be numeric');
  }

  // Date validation (if provided)
  //if (formData.date) {
    //const dateValidation = validateDate(formData.date);
    //if (!dateValidation.isValid) {
      //errors.push(dateValidation.error);
    //}
  //}

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate nomination withdrawal form data
export const validateNominationWithdrawalForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Required fields validation
  const requiredFields = [
    { field: 'candidateName', name: 'Candidate Name' },
    { field: 'fatherOrHusband', name: 'Father/Husband Name' },
    { field: 'post', name: 'Post' },
    { field: 'serialNumber', name: 'Serial Number' },
    { field: 'jcic', name: 'JCIC/JID Number' },
    { field: 'signature', name: 'Signature' },
  ];

  requiredFields.forEach(({ field, name }) => {
    const validation = validateRequired(formData[field], name);
    if (!validation.isValid) {
      errors.push(validation.error);
    }
  });

  // JCIC validation
  const jcicValidation = validateJCIC(formData.jcic);
  if (!jcicValidation.isValid) {
    errors.push(jcicValidation.error);
  }

  // Serial number validation (should be numeric)
  if (formData.serialNumber && !/^\d+$/.test(formData.serialNumber)) {
    errors.push('Serial Number must be numeric');
  }

  // Date validation (if provided)
  //if (formData.date) {
    //const dateValidation = validateDate(formData.date);
    //if (!dateValidation.isValid) {
      //errors.push(dateValidation.error);
    //}
  //}

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate file uploads
export const validateFileUpload = (file, maxSize = 5 * 1024 * 1024) => { // 5MB default
  if (!file) return { isValid: true }; // File is optional

  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size && file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }

  if (file.type && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not supported. Please upload JPG, PNG, PDF, or DOC files' };
  }

  return { isValid: true };
};

// Sanitize form data before submission
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'string') {
      sanitized[key] = formData[key].trim();
    } else {
      sanitized[key] = formData[key];
    }
  });
  
  return sanitized;
};

// Validate death information form data
export const validateDeathInfoForm = (formData) => {
  const errors = [];
  const warnings = [];

  // Deceased Information - Required
  const deceasedRequired = [
    { field: 'deceasedName', name: 'Deceased Name' },
    { field: 'deceasedAge', name: 'Deceased Age' },
    { field: 'deceasedMembership', name: 'Deceased Membership Number' },
    { field: 'deceasedAddress', name: 'Deceased Address' },
    { field: 'causeOfDeath', name: 'Cause of Death' },
    { field: 'doctorName', name: 'Doctor\'s Name' },
  ];

  deceasedRequired.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // Deceased JCIC validation
  const deceasedJcicValidation = validateJCIC(formData.deceasedMembership);
  if (!deceasedJcicValidation.isValid) {
    errors.push(`Deceased ${deceasedJcicValidation.error}`);
  }

  // Deceased CNIC validation (Pakistani format)
  if (formData.deceasedCnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.deceasedCnic)) {
      errors.push('Deceased CNIC must be in format: XXXXX-XXXXXXX-X');
    }
  }

  // Deceased age validation
  if (formData.deceasedAge) {
    const age = parseInt(formData.deceasedAge);
    if (isNaN(age) || age < 0 || age > 150) {
      errors.push('Deceased age must be a valid number between 0 and 150');
    }
  }

  // Father Information - Required
  const fatherRequired = [
    { field: 'fatherName', name: 'Father Name' },
    { field: 'fatherSurname', name: 'Father Surname' },
    { field: 'fatherMembership', name: 'Father Membership Number' },
  ];

  fatherRequired.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // Father JCIC validation
  const fatherJcicValidation = validateJCIC(formData.fatherMembership);
  if (!fatherJcicValidation.isValid) {
    errors.push(`Father ${fatherJcicValidation.error}`);
  }

  // Father CNIC validation (Pakistani format)
  if (formData.fatherCnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.fatherCnic)) {
      errors.push('Father CNIC must be in format: XXXXX-XXXXXXX-X');
    }
  }

  // Husband Information - Optional but if provided, validate
  if (formData.husbandName || formData.husbandSurname || formData.husbandMembership || formData.husbandCnic) {
    const husbandRequired = [
      { field: 'husbandName', name: 'Husband Name' },
      { field: 'husbandSurname', name: 'Husband Surname' },
      { field: 'husbandMembership', name: 'Husband Membership Number' },
    ];

    husbandRequired.forEach(({ field, name }) => {
      const result = validateRequired(formData[field], name);
      if (!result.isValid) errors.push(result.error);
    });

    // Husband JCIC validation
    if (formData.husbandMembership) {
      const husbandJcicValidation = validateJCIC(formData.husbandMembership);
      if (!husbandJcicValidation.isValid) {
        errors.push(`Husband ${husbandJcicValidation.error}`);
      }
    }

    // Husband CNIC validation (Pakistani format)
    if (formData.husbandCnic) {
      const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
      if (!cnicRegex.test(formData.husbandCnic)) {
        errors.push('Husband CNIC must be in format: XXXXX-XXXXXXX-X');
      }
    }
  }

  // Informer 1 Information - Required
  const informer1Required = [
    { field: 'informer1Name', name: 'Informer 1 Name' },
    { field: 'informer1Surname', name: 'Informer 1 Surname' },
    { field: 'informer1Membership', name: 'Informer 1 Membership Number' },
    { field: 'informer1Address', name: 'Informer 1 Address' },
    { field: 'informer1Phone', name: 'Informer 1 Phone Number' },
  ];

  informer1Required.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // Informer 1 JCIC validation
  const informer1JcicValidation = validateJCIC(formData.informer1Membership);
  if (!informer1JcicValidation.isValid) {
    errors.push(`Informer 1 ${informer1JcicValidation.error}`);
  }

  // Informer 1 CNIC validation (Pakistani format)
  if (formData.informer1Cnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.informer1Cnic)) {
      errors.push('Informer 1 CNIC must be in format: XXXXX-XXXXXXX-X');
    }
  }

  // Informer 1 phone validation
  const informer1PhoneValidation = validatePhone(formData.informer1Phone);
  if (!informer1PhoneValidation.isValid) {
    errors.push(`Informer 1 ${informer1PhoneValidation.error}`);
  }

  // Informer 2 Information - Required
  const informer2Required = [
    { field: 'informer2Name', name: 'Informer 2 Name' },
    { field: 'informer2Surname', name: 'Informer 2 Surname' },
    { field: 'informer2Membership', name: 'Informer 2 Membership Number' },
    { field: 'informer2Address', name: 'Informer 2 Address' },
    { field: 'informer2Phone', name: 'Informer 2 Phone Number' },
  ];

  informer2Required.forEach(({ field, name }) => {
    const result = validateRequired(formData[field], name);
    if (!result.isValid) errors.push(result.error);
  });

  // Informer 2 JCIC validation
  const informer2JcicValidation = validateJCIC(formData.informer2Membership);
  if (!informer2JcicValidation.isValid) {
    errors.push(`Informer 2 ${informer2JcicValidation.error}`);
  }

  // Informer 2 CNIC validation (Pakistani format)
  if (formData.informer2Cnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.informer2Cnic)) {
      errors.push('Informer 2 CNIC must be in format: XXXXX-XXXXXXX-X');
    }
  }

  // Informer 2 phone validation
  const informer2PhoneValidation = validatePhone(formData.informer2Phone);
  if (!informer2PhoneValidation.isValid) {
    errors.push(`Informer 2 ${informer2PhoneValidation.error}`);
  }

  // Address length validation
  if (formData.deceasedAddress && formData.deceasedAddress.length < 10) {
    warnings.push('Please provide a complete address for the deceased');
  }

  if (formData.informer1Address && formData.informer1Address.length < 10) {
    warnings.push('Please provide a complete address for Informer 1');
  }

  if (formData.informer2Address && formData.informer2Address.length < 10) {
    warnings.push('Please provide a complete address for Informer 2');
  }

  // Cause of death validation
  if (formData.causeOfDeath && formData.causeOfDeath.length < 5) {
    warnings.push('Please provide a detailed cause of death');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Takhti Request form data
export const validateTakhtiRequestForm = (formData) => {
  const errors = [];

  // Validate required fields
  if (!formData.applicantName || formData.applicantName.trim() === '') {
    errors.push('Applicant Name is required');
  }
  if (!formData.deceasedName || formData.deceasedName.trim() === '') {
    errors.push('Deceased Name is required');
  }
  if (!formData.graveyard || formData.graveyard.trim() === '') {
    errors.push('Graveyard selection is required');
  }

  // Validate JCIC
  const jcicValidation = validateJCIC(formData.jcic);
  if (!jcicValidation.isValid) {
    errors.push(jcicValidation.error);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};