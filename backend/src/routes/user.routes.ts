import { Router } from 'express';
import { createUser, getAllUsers, updateUserRole, deleteUser } from '../controllers/userController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

router.use(authenticateToken);
router.use(requireRole([Role.ADMIN]));

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
