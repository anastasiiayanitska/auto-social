import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const uploadSingleImage = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation: [{ width: 500, height: 500, crop: 'fill' }],
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (
  filePaths: string[],
  folder: string,
) => {
  try {
    const uploadPromises = filePaths.map(async (filePath) => {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        transformation: [{ width: 500, height: 500, crop: 'fill' }],
      });

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Files upload error:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string) => {
  try {
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicIdWithExtension = filename.split('.');
    const publicId = publicIdWithExtension[0];

    let folder = 'uploads';
    if (imageUrl.includes('/avatars/')) {
      folder = 'avatars';
    }

    if (publicId) {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      console.log(`Images ${folder}/${publicId} wad deleted`);
    }
  } catch (error) {
    console.error('Error deleting with Cloudinary:', error);
    throw error;
  }
};
