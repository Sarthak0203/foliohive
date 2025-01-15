import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function uploadImage(imageData) {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      // Remove upload_preset if you don't have one
      // upload_preset: 'your_upload_preset', 
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error; 
  }
}