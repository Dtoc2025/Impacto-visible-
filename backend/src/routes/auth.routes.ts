import { Router } from 'express';
import { register, login, me, updateProfile } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, me);
router.put('/me', authRequired, updateProfile);

export default router;