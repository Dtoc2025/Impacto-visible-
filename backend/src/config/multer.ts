import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const folder = file.fieldname === 'avatar' ? 'uploads/avatars' : 'uploads/projects';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});