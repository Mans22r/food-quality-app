import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { generateReportSummary, evaluateReport } from '../services/aiService';
import { createAuditLog } from '../services/auditService';

export const submitReport = async (req: Request, res: Response) => {
    try {
        const { formId, data } = req.body; // data is { fieldId: value }
        const inspectorId = req.user!.userId;

        // Fetch form fields to construct key-value map for AI
        const formFields = await prisma.formField.findMany({
            where: { formId },
        });

        const reportDataForAI: Record<string, string> = {};
        const fieldDataForDb = [];

        for (const field of formFields) {
            const value = data[field.id];
            if (value) {
                reportDataForAI[field.label] = String(value);
                fieldDataForDb.push({
                    fieldId: field.id,
                    value: String(value),
                });
            }
        }

        // AI Processing
        const aiSummary = await generateReportSummary(reportDataForAI);
        const aiEvaluation = await evaluateReport(reportDataForAI);

        const report = await prisma.inspectionReport.create({
            data: {
                formId,
                inspectorId,
                aiSummary,
                aiEvaluation,
                status: 'SUBMITTED',
                fields: {
                    create: fieldDataForDb,
                },
            },
        });

        await createAuditLog(inspectorId, 'REPORT_SUBMITTED', `report:${report.id}`);
        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
};

export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await prisma.inspectionReport.findMany({
            include: {
                inspector: { select: { name: true } },
                form: { select: { title: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const report = await prisma.inspectionReport.findUnique({
            where: { id },
            include: {
                inspector: { select: { name: true } },
                form: { select: { title: true } },
                fields: { include: { field: true } },
            },
        });
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};


export const approveReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminId = req.user!.userId;

        const report = await prisma.inspectionReport.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });

        await createAuditLog(adminId, 'REPORT_APPROVED', `report:${id}`);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve report' });
    }
};
