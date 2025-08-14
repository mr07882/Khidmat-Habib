import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dc9gpwqi5';
const CLOUDINARY_API_KEY = '636438894525512';
const CLOUDINARY_API_SECRET = 'hs3qPfl4UDO56WbXUUggbum4LZw';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (imageUri, folder = 'forms') => {
  try {
    // Create form data for upload
    const formData = new FormData();
    
    // Add the image file
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    
    // Add Cloudinary parameters
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    formData.append('folder', folder);
    
    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const result = await response.json();
    
    if (result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        data: result
      };
    } else {
      throw new Error(`Image upload failed: ${result.error?.message || 'No URL returned'}`);
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to upload image',
      details: error.message
    };
  }
};

// Upload document to Cloudinary
export const uploadDocumentToCloudinary = async (fileUri, fileName, folder = 'forms/documents') => {
  try {
    // Determine file type based on extension
    const fileExtension = fileName.split('.').pop().toLowerCase();
    let mimeType = 'application/octet-stream';
    let resourceType = 'auto';
    
    switch (fileExtension) {
      case 'pdf':
        mimeType = 'application/pdf';
        resourceType = 'raw';
        break;
      case 'doc':
        mimeType = 'application/msword';
        resourceType = 'raw';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        resourceType = 'raw';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        resourceType = 'image';
        break;
      case 'png':
        mimeType = 'image/png';
        resourceType = 'image';
        break;
      default:
        mimeType = 'application/octet-stream';
        resourceType = 'raw';
    }
    
    // Create form data for upload
    const formData = new FormData();
    
    // Add the file
    formData.append('file', {
      uri: fileUri,
      type: mimeType,
      name: fileName,
    });
    
    // Add Cloudinary parameters
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    formData.append('folder', folder);
    
    // Upload to Cloudinary with proper resource type
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const result = await response.json();
    
    if (result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        fileName: fileName,
        data: result
      };
    } else {
      throw new Error(`Upload failed: ${result.error?.message || 'No URL returned'}`);
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to upload document',
      details: error.message
    };
  }
};

// Upload multiple files to Cloudinary
export const uploadMultipleFiles = async (files, folder = 'forms') => {
  try {
    const uploadPromises = files.map(async (file) => {
      if (file.type === 'image') {
        return await uploadImageToCloudinary(file.uri, folder);
      } else {
        return await uploadDocumentToCloudinary(file.uri, file.name, folder);
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
    return {
      success: false,
      error: 'Failed to upload multiple files',
      details: error.message
    };
  }
};

// Delete file from Cloudinary (if needed)
export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: publicId, // You'll need to implement proper token generation
        }),
      }
    );
    
    const result = await response.json();
    
    return {
      success: result.result === 'ok',
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete file',
      details: error.message
    };
  }
};

// Helper function to get file info from URI
export const getFileInfo = async (fileUri) => {
  try {
    const fileInfo = await RNFetchBlob.fs.stat(fileUri);
    return {
      size: fileInfo.size,
      path: fileInfo.path,
      filename: fileInfo.filename,
      lastModified: fileInfo.lastModified,
    };
  } catch (error) {
    return null;
  }
}; 