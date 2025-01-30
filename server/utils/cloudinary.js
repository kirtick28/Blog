const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (imageString) => {
  try {
    if (!imageString) return null;
    
    const uploadResponse = await cloudinary.uploader.upload(imageString, {
      folder: 'blog_posts',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      transformation: [
        { width: 1200, height: 675, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = { uploadImage };
