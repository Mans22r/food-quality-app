"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
// Inspector only
router.post('/', (0, auth_1.requireRole)([types_1.Role.INSPECTOR]), reportController_1.submitReport);
// Admin only
router.put('/:id/approve', (0, auth_1.requireRole)([types_1.Role.ADMIN]), reportController_1.approveReport);
// All roles (except maybe Inspector viewing all logic, but let's allow all auth users for now or restrict)
router.get('/', (0, auth_1.requireRole)([types_1.Role.ADMIN, types_1.Role.KITCHEN_MANAGER, types_1.Role.HOTEL_MANAGEMENT]), reportController_1.getReports);
router.get('/:id', (0, auth_1.requireRole)([types_1.Role.ADMIN, types_1.Role.KITCHEN_MANAGER, types_1.Role.HOTEL_MANAGEMENT, types_1.Role.INSPECTOR]), reportController_1.getReportById);
exports.default = router;
