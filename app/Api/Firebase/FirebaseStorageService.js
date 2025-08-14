import storage from '@react-native-firebase/storage';

// Upload image to Firebase Storage
export const uploadImageToFirebaseStorage = async (imageUri, fileName, folder = 'forms/images') => {
  try {
    console.log('Starting image upload to Firebase Storage:', { imageUri, fileName, folder });
    
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    
    // Get storage reference
    const storageRef = storage().ref(storagePath);
    
    console.log('Uploading image to Firebase Storage path:', storagePath);
    
    // Upload the file
    await storageRef.putFile(imageUri);
    
    // Get download URL
    const downloadURL = await storageRef.getDownloadURL();
    
    console.log('Image upload successful, URL:', downloadURL);
    
    return {
      success: true,
      url: downloadURL,
      fileName: uniqueFileName,
      storagePath: storagePath
    };
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    return {
      success: false,
      error: 'Failed to upload image',
      details: error.message
    };
  }
};

// Upload document to Firebase Storage
export const uploadDocumentToFirebaseStorage = async (fileUri, fileName, folder = 'forms/documents') => {
  try {
    console.log('Starting document upload to Firebase Storage:', { fileUri, fileName, folder });
    
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    
    // Get storage reference
    const storageRef = storage().ref(storagePath);
    
    console.log('Uploading document to Firebase Storage path:', storagePath);
    
    // Upload the file
    await storageRef.putFile(fileUri);
    
    // Get download URL
    const downloadURL = await storageRef.getDownloadURL();
    
    console.log('Document upload successful, URL:', downloadURL);
    
    return {
      success: true,
      url: downloadURL,
      fileName: uniqueFileName,
      storagePath: storagePath
    };
  } catch (error) {
    console.error('Error uploading document to Firebase Storage:', error);
    return {
      success: false,
      error: 'Failed to upload document',
      details: error.message
    };
  }
};

// Upload multiple files to Firebase Storage
export const uploadMultipleFilesToFirebaseStorage = async (files, folder = 'forms') => {
  try {
    const uploadPromises = files.map(async (file) => {
      if (file.type === 'image') {
        return await uploadImageToFirebaseStorage(file.uri, file.name, `${folder}/images`);
      } else {
        return await uploadDocumentToFirebaseStorage(file.uri, file.name, `${folder}/documents`);
      }
    });
    
    const results = await Promise.all(uploadPromises);
    
    // Check if all uploads were successful
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);
    
    return {
      success: failedUploads.length === 0,
      successfulUploads,
      failedUploads,
      totalFiles: files.length,
      successfulCount: successfulUploads.length,
      failedCount: failedUploads.length
    };
  } catch (error) {
    console.error('Error uploading multiple files to Firebase Storage:', error);
    return {
      success: false,
      error: 'Failed to upload multiple files',
      details: error.message
    };
  }
};

// Delete file from Firebase Storage
export const deleteFileFromFirebaseStorage = async (storagePath) => {
  try {
    const storageRef = storage().ref(storagePath);
    await storageRef.delete();
    
    return {
      success: true,
      message: 'File deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    return {
      success: false,
      error: 'Failed to delete file',
      details: error.message
    };
  }
};

// Get file info from Firebase Storage
export const getFileInfoFromFirebaseStorage = async (storagePath) => {
  try {
    const storageRef = storage().ref(storagePath);
    const metadata = await storageRef.getMetadata();
    
    return {
      success: true,
      metadata: metadata
    };
  } catch (error) {
    console.error('Error getting file info from Firebase Storage:', error);
    return {
      success: false,
      error: 'Failed to get file info',
      details: error.message
    };
  }
}; 