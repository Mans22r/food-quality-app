import { Router } from 'express';
import { createForm, getForms, getFormById } from '../controllers/formController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

router.use(authenticateToken);

// Admin only
router.post('/', requireRole([Role.ADMIN]), createForm);

// Inspectors, Managers, Admin
router.get('/', requireRole([Role.INSPECTOR, Role.KITCHEN_MANAGER, Role.HOTEL_MANAGEMENT, Role.ADMIN]), getForms);
router.get('/:id', requireRole([Role.INSPECTOR, Role.KITCHEN_MANAGER, Role.HOTEL_MANAGEMENT, Role.ADMIN]), getFormById);

export default router;
