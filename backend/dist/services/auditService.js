"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = void 0;
const database_1 = require("../config/database");
const createAuditLog = async (userId, action, resource, metadata) => {
    try {
        await database_1.prisma.auditLog.create({
            data: {
                userId,
                action,
                resource,
                metadata,
            },
        });
    }
    catch (error) {
        console.error('Failed to create audit log:', error);
    }
};
exports.createAuditLog = createAuditLog;
