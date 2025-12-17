import { Router } from 'express';
import { submitReport, getReports, getReportById, approveReport } from '../controllers/reportController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

router.use(authenticateToken);

// Inspector only
router.post('/', requireRole([Role.INSPECTOR]), submitReport);

// Admin only
router.put('/:id/approve', requireRole([Role.ADMIN]), approveReport);

// All roles (except maybe Inspector viewing all logic, but let's allow all auth users for now or restrict)
router.get('/', requireRole([Role.ADMIN, Role.KITCHEN_MANAGER, Role.HOTEL_MANAGEMENT]), getReports);
router.get('/:id', requireRole([Role.ADMIN, Role.KITCHEN_MANAGER, Role.HOTEL_MANAGEMENT, Role.INSPECTOR]), getReportById);

export default router;
