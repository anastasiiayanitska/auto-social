import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Переконаємося, що директорія для завантажень існує
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Налаштування тимчасового диску для збереження файлів
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Фільтр файлів для multer
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Тільки зображення дозволені для завантаження!'));
  }
};

// Middleware для завантаження одного файлу (аватар)
export const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB ліміт
  fileFilter: fileFilter,
});

// Middleware для завантаження кількох файлів
export const uploadMultiple = multer({
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB ліміт
  fileFilter: fileFilter,
}).array('images', 10);
