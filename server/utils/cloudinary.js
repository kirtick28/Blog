const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

const uploadImage = async (image, folder = 'blog_posts') => {
  try {
    if (!image) return null;

    let uploadResponse;
    
    if (Buffer.isBuffer(image)) {
      // Handle buffer upload (from multer)
      const stream = bufferToStream(image);
      uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
            transformation: [
              { width: 1200, height: 675, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
    } else {
      // Handle base64 string upload
      uploadResponse = await cloudinary.uploader.upload(image, {
        folder,
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: [
          { width: 1200, height: 675, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
    }

    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = { uploadImage };
