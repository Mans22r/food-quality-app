"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formController_1 = require("../controllers/formController");
const auth_1 = require("../middleware/auth");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
// Admin only
router.post('/', (0, auth_1.requireRole)([types_1.Role.ADMIN]), formController_1.createForm);
// Inspectors, Managers, Admin
router.get('/', (0, auth_1.requireRole)([types_1.Role.INSPECTOR, types_1.Role.KITCHEN_MANAGER, types_1.Role.HOTEL_MANAGEMENT, types_1.Role.ADMIN]), formController_1.getForms);
router.get('/:id', (0, auth_1.requireRole)([types_1.Role.INSPECTOR, types_1.Role.KITCHEN_MANAGER, types_1.Role.HOTEL_MANAGEMENT, types_1.Role.ADMIN]), formController_1.getFormById);
exports.default = router;
