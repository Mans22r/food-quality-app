"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guidelineController_1 = require("../controllers/guidelineController");
const auth_1 = require("../middleware/auth");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/', guidelineController_1.getGuidelines);
router.get('/:id', guidelineController_1.getGuidelineById);
// Protected routes (authentication required)
router.use(auth_1.authenticateToken);
// Admin only
router.post('/', (0, auth_1.requireRole)([types_1.Role.ADMIN]), guidelineController_1.createGuideline);
router.put('/:id', (0, auth_1.requireRole)([types_1.Role.ADMIN]), guidelineController_1.updateGuideline);
router.delete('/:id', (0, auth_1.requireRole)([types_1.Role.ADMIN]), guidelineController_1.deleteGuideline);
exports.default = router;
