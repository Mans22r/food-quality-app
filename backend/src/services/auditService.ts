import { prisma } from '../config/database';

export const createAuditLog = async (userId: string, action: string, resource?: string, metadata?: any) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                resource,
                metadata,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};
