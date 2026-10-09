import { Router } from 'express';
import { stats, byCategory } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/stats', stats);
router.get('/by-category', byCategory);

export default router;