"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuideline = exports.updateGuideline = exports.getGuidelineById = exports.getGuidelines = exports.createGuideline = void 0;
const database_1 = require("../config/database");
const createGuideline = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const guideline = await database_1.prisma.guideline.create({
            data: {
                title,
                content,
                category,
            },
        });
        res.status(201).json(guideline);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create guideline' });
    }
};
exports.createGuideline = createGuideline;
const getGuidelines = async (req, res) => {
    try {
        const guidelines = await database_1.prisma.guideline.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(guidelines);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch guidelines' });
    }
};
exports.getGuidelines = getGuidelines;
const getGuidelineById = async (req, res) => {
    try {
        const { id } = req.params;
        const guideline = await database_1.prisma.guideline.findUnique({
            where: { id },
        });
        if (!guideline) {
            return res.status(404).json({ error: 'Guideline not found' });
        }
        res.json(guideline);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch guideline' });
    }
};
exports.getGuidelineById = getGuidelineById;
const updateGuideline = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;
        // Check if guideline exists
        const existingGuideline = await database_1.prisma.guideline.findUnique({
            where: { id },
        });
        if (!existingGuideline) {
            return res.status(404).json({ error: 'Guideline not found' });
        }
        const guideline = await database_1.prisma.guideline.update({
            where: { id },
            data: {
                title,
                content,
                category,
            },
        });
        res.json(guideline);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update guideline' });
    }
};
exports.updateGuideline = updateGuideline;
const deleteGuideline = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if guideline exists
        const existingGuideline = await database_1.prisma.guideline.findUnique({
            where: { id },
        });
        if (!existingGuideline) {
            return res.status(404).json({ error: 'Guideline not found' });
        }
        await database_1.prisma.guideline.delete({
            where: { id },
        });
        res.json({ message: 'Guideline deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete guideline' });
    }
};
exports.deleteGuideline = deleteGuideline;
