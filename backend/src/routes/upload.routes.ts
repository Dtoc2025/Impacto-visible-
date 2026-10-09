import { Router } from 'express';
import { upload } from '../config/multer.js';
import { uploadImage, uploadMultiple } from '../controllers/upload.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/single', authRequired, upload.single('image'), uploadImage);
router.post('/multiple', authRequired, upload.array('images', 10), uploadMultiple);

export default router;