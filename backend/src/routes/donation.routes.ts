import { Router } from 'express';
import { create, myDonations, listByProject } from '../controllers/donation.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authRequired, create);
router.get('/me', authRequired, myDonations);
router.get('/project/:projectId', listByProject);

export default router;