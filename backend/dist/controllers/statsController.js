"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = require("../config/database");
const getDashboardStats = async (req, res) => {
    try {
        const totalReports = await database_1.prisma.inspectionReport.count();
        const approvedReports = await database_1.prisma.inspectionReport.count({
            where: { status: 'APPROVED' },
        });
        const pendingReports = await database_1.prisma.inspectionReport.count({
            where: { status: 'SUBMITTED' },
        });
        const goodEvaluations = await database_1.prisma.inspectionReport.count({
            where: { aiEvaluation: 'GOOD' },
        });
        const recentReports = await database_1.prisma.inspectionReport.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
