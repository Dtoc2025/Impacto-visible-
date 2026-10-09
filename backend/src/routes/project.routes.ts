import { Router } from 'express';
import { list, getById, create, update, remove, mine } from '../controllers/project.controller.js';
import { authRequired, orgOrAdminRequired } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', list);
router.get('/mine', authRequired, mine);
router.get('/:id', getById);
router.post('/', authRequired, orgOrAdminRequired, create);
router.put('/:id', authRequired, orgOrAdminRequired, update);
router.delete('/:id', authRequired, orgOrAdminRequired, remove);

export default router;