import fs from 'fs';
import { uploadMultipleImages, deleteImage } from '../config/uploadService';

export const imageHandler = {
  async uploadImages(filePaths: string[]): Promise<string[]> {
    try {
      console.log('Завантаження файлів у Cloudinary:', filePaths);
      const imagesUrl = await uploadMultipleImages(filePaths, 'images');
      console.log('Завантажено URL зображень:', imagesUrl);
      return imagesUrl;
    } catch (uploadError) {
      console.error('Помилка завантаження зображень:', uploadError);

      // Clean up local files on upload failure
      filePaths.forEach((path) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });

      return [];
    }
  },

  async deleteImages(imageUrls: string[]): Promise<void> {
    try {
      for (const imageUrl of imageUrls) {
        await deleteImage(imageUrl);
      }
    } catch (deleteError) {
      console.error('Помилка видалення зображень:', deleteError);
      // We'll just log the error but continue with the operation
    }
  },
};
