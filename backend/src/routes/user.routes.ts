import { Router } from 'express';
import { createUser, getAllUsers } from '../controllers/userController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

router.use(authenticateToken);
router.use(requireRole([Role.ADMIN]));

router.post('/', createUser);
router.get('/', getAllUsers);

export default router;
