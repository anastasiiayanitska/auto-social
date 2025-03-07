import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Функція для завантаження одного файлу (наприклад, аватару)
export const uploadSingleImage = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation: [{ width: 500, height: 500, crop: 'fill' }],
    });

    // Видалення тимчасового файлу після успішного завантаження
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('Помилка завантаження файлу:', error);
    throw error;
  }
};

// Функція для завантаження декількох файлів
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

      // Видалення тимчасового файлу після успішного завантаження
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Помилка завантаження файлів:', error);
    throw error;
  }
};

// Функція для видалення файлу з Cloudinary
export const deleteImage = async (imageUrl: string) => {
  try {
    // Отримання public_id з URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicIdWithExtension = filename.split('.');
    const publicId = publicIdWithExtension[0];

    // Отримання папки з URL
    let folder = 'uploads'; // За замовчуванням
    if (imageUrl.includes('/avatars/')) {
      folder = 'avatars';
    }

    // Видалення зображення
    if (publicId) {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      console.log(`Зображення ${folder}/${publicId} успішно видалено`);
    }
  } catch (error) {
    console.error('Помилка видалення файлу з Cloudinary:', error);
    throw error;
  }
};
