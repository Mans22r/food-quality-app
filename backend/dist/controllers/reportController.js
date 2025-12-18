"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveReport = exports.getReportById = exports.getReports = exports.submitReport = void 0;
const database_1 = require("../config/database");
const aiService_1 = require("../services/aiService");
const auditService_1 = require("../services/auditService");
const submitReport = async (req, res) => {
    try {
        const { formId, data } = req.body; // data is { fieldId: value }
        const inspectorId = req.user.userId;
        // Fetch form fields to construct key-value map for AI
        const formFields = await database_1.prisma.formField.findMany({
            where: { formId },
        });
        const reportDataForAI = {};
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
        const aiSummary = await (0, aiService_1.generateReportSummary)(reportDataForAI);
        const aiEvaluation = await (0, aiService_1.evaluateReport)(reportDataForAI);
        const report = await database_1.prisma.inspectionReport.create({
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
        await (0, auditService_1.createAuditLog)(inspectorId, 'REPORT_SUBMITTED', `report:${report.id}`);
        res.status(201).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
};
exports.submitReport = submitReport;
const getReports = async (req, res) => {
    try {
        const reports = await database_1.prisma.inspectionReport.findMany({
            include: {
                inspector: { select: { name: true } },
                form: { select: { title: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
exports.getReports = getReports;
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await database_1.prisma.inspectionReport.findUnique({
            where: { id },
            include: {
                inspector: { select: { name: true } },
                form: { select: { title: true } },
                fields: { include: { field: true } },
            },
        });
        if (!report)
            return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};
exports.getReportById = getReportById;
const approveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.userId;
        const report = await database_1.prisma.inspectionReport.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });
        await (0, auditService_1.createAuditLog)(adminId, 'REPORT_APPROVED', `report:${id}`);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to approve report' });
    }
};
exports.approveReport = approveReport;
