import { Request, Response } from 'express';

const BASE_URL = process.env.PUBLIC_URL || 'http://localhost:4000';

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No se envió ningún archivo' });
  }
  const folder = req.file.fieldname === 'avatar' ? 'avatars' : 'projects';
  const url = `${BASE_URL}/uploads/${folder}/${req.file.filename}`;
  res.status(201).json({ url });
}

export async function uploadMultiple(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No se enviaron archivos' });
  }
  const urls = files.map((f) => `${BASE_URL}/uploads/projects/${f.filename}`);
  res.status(201).json({ urls });
}