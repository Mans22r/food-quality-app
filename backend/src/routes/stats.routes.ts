import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole([Role.ADMIN, Role.HOTEL_MANAGEMENT]), getDashboardStats);

export default router;
