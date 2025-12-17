import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalReports = await prisma.inspectionReport.count();
        const approvedReports = await prisma.inspectionReport.count({
            where: { status: 'APPROVED' },
        });
        const pendingReports = await prisma.inspectionReport.count({
            where: { status: 'SUBMITTED' },
        });
        const goodEvaluations = await prisma.inspectionReport.count({
            where: { aiEvaluation: 'GOOD' },
        });

        const recentReports = await prisma.inspectionReport.findMany({
            take: 5,
            orderBy: { submittedAt: 'desc' },
            include: {
                inspector: { select: { name: true } },
                form: { select: { title: true } },
            },
        });

        res.json({
            totalReports,
            approvedReports,
            pendingReports,
            goodEvaluations,
            recentReports,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
