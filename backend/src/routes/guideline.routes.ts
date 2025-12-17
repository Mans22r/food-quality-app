import { Router } from 'express';
import { 
    createGuideline, 
    getGuidelines, 
    getGuidelineById, 
    updateGuideline, 
    deleteGuideline 
} from '../controllers/guidelineController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

// Public routes (no authentication required)
router.get('/', getGuidelines);
router.get('/:id', getGuidelineById);

// Protected routes (authentication required)
router.use(authenticateToken);

// Admin only
router.post('/', requireRole([Role.ADMIN]), createGuideline);
router.put('/:id', requireRole([Role.ADMIN]), updateGuideline);
router.delete('/:id', requireRole([Role.ADMIN]), deleteGuideline);

export default router;