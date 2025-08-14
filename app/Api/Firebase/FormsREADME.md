# Forms Backend System

This directory contains the backend system for handling form submissions in the KPSIAJ application.

## Overview

The forms system allows members to submit various forms (nomination forms, withdrawal forms, etc.) and stores them in Firebase Realtime Database with proper validation, file uploads, and status tracking.

## File Structure

- `FormAPI.js` - Core form submission and retrieval functions
- `CloudinaryService.js` - File upload service for images and documents
- `FormValidation.js` - Form validation utilities
- `FormsREADME.md` - This documentation file

## Database Structure

### Firebase Database Schema

```
Firebase Database:
├── Members/
│   ├── 3333444455556666/
│   │   └── ... (existing member data)
│   └── 4444555566667777/
│       └── ... (existing member data)
├── NominationForm/
│   ├── 3333444455556666/
│   │   ├── fullName: "Mannan"
│   │   ├── surname: "Rangoonia"
│   │   ├── jid: "3333444455556666"
│   │   ├── office: "President"
│   │   ├── photoUrl: "https://res.cloudinary.com/..."
│   │   ├── submittedAt: "2024-01-15T10:30:00.000Z"
│   │   ├── submittedBy: "3333444455556666"
│   │   ├── status: "pending"
│   │   ├── submissionId: "3333444455556666_1705312200000"
│   │   └── ... (all form fields)
│   └── 4444555566667777/
│       └── ... (another nomination form)
├── NominationWithdrawalForm/
│   └── ... (similar structure)
├── DeathInfoForm/
│   └── ... (similar structure)
└── ... (other form types)
```

## Key Features

### 1. Form Submission
- **Validation**: Comprehensive form validation before submission
- **File Uploads**: Automatic upload of photos and documents to Cloudinary
- **Status Tracking**: Forms are stored with status (pending, approved, rejected)
- **Metadata**: Each submission includes timestamps, submission ID, and user info

### 2. File Management
- **Cloudinary Integration**: All files are uploaded to Cloudinary with organized folders
- **Multiple File Types**: Support for images (JPG, PNG) and documents (PDF, DOC, DOCX)
- **Size Limits**: Configurable file size limits (default 5MB)
- **Organized Storage**: Files are stored in organized folders (e.g., `forms/nominations/`)

### 3. Validation System
- **Field Validation**: Required fields, format validation (email, phone, JCIC)
- **Business Logic**: Validation rules specific to each form type
- **Warnings**: Optional field warnings without blocking submission
- **Error Messages**: Clear, user-friendly error messages

## API Functions

### FormAPI.js

#### `submitNominationForm(jcic, formData)`
Submits a nomination form for a specific member.

**Parameters:**
- `jcic` (string): The JCIC number of the submitting member
- `formData` (object): The complete form data

**Returns:**
```javascript
{
  success: true,
  message: 'Nomination form submitted successfully',
  submissionId: '3333444455556666_1705312200000',
  data: { /* submitted data */ }
}
```

#### `getNominationForm(jcic)`
Retrieves a nomination form for a specific member.

#### `getAllNominationForms()`
Retrieves all nomination forms (for admin purposes).

#### `updateNominationStatus(jcic, status, adminNotes)`
Updates the status of a nomination form (for admin purposes).

#### `submitForm(formType, jcic, formData)`
Generic function to submit any form type.

### CloudinaryService.js

#### `uploadImageToCloudinary(imageUri, folder)`
Uploads an image to Cloudinary.

#### `uploadDocumentToCloudinary(fileUri, fileName, folder)`
Uploads a document to Cloudinary.

#### `uploadMultipleFiles(files, folder)`
Uploads multiple files to Cloudinary.

### FormValidation.js

#### `validateNominationForm(formData)`
Validates nomination form data.

**Returns:**
```javascript
{
  isValid: true,
  errors: [],
  warnings: ['Email address is recommended for communication']
}
```

## Usage Examples

### Submitting a Nomination Form

```javascript
import { 
  submitNominationForm, 
  validateNominationForm, 
  sanitizeFormData,
  uploadImageToCloudinary 
} from '../Api/Firebase';

// 1. Prepare form data
const formData = {
  fullName: 'Mannan',
  surname: 'Rangoonia',
  jid: '3333444455556666',
  office: 'President',
  // ... other fields
};

// 2. Sanitize data
const sanitizedData = sanitizeFormData(formData);

// 3. Validate data
const validation = validateNominationForm(sanitizedData);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
  return;
}

// 4. Upload photo if provided
let photoUrl = null;
if (photo) {
  const uploadResult = await uploadImageToCloudinary(photo, 'forms/nominations');
  if (uploadResult.success) {
    photoUrl = uploadResult.url;
  }
}

// 5. Submit form
const result = await submitNominationForm(jcic, {
  ...sanitizedData,
  photoUrl
});

if (result.success) {
  console.log('Form submitted successfully!');
}
```

### Retrieving Form Data

```javascript
import { getNominationForm } from '../Api/Firebase';

const result = await getNominationForm('3333444455556666');
if (result.success) {
  console.log('Form data:', result.data);
} else {
  console.log('No form found');
}
```

## Configuration

### Cloudinary Configuration

Update the Cloudinary configuration in `CloudinaryService.js`:

```javascript
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
```

### File Size Limits

Update file size limits in `FormValidation.js`:

```javascript
export const validateFileUpload = (file, maxSize = 10 * 1024 * 1024) => { // 10MB
  // ... validation logic
};
```

## Security Considerations

1. **Authentication**: All form submissions require valid user authentication
2. **Validation**: Server-side validation prevents malicious data
3. **File Uploads**: File type and size restrictions prevent abuse
4. **Data Sanitization**: All input data is sanitized before storage
5. **Access Control**: Form data is only accessible to the submitting user and admins

## Error Handling

The system provides comprehensive error handling:

- **Network Errors**: Graceful handling of network failures
- **Validation Errors**: Clear error messages for invalid data
- **Upload Errors**: Specific error messages for file upload failures
- **Database Errors**: Proper error handling for Firebase operations

## Future Enhancements

1. **Email Notifications**: Send confirmation emails for form submissions
2. **Status Updates**: Real-time status updates for form processing
3. **Admin Dashboard**: Web interface for managing form submissions
4. **Form Templates**: Reusable form templates for different form types
5. **Analytics**: Form submission analytics and reporting 