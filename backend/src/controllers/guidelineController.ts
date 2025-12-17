import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const createGuideline = async (req: Request, res: Response) => {
    try {
        const { title, content, category } = req.body;

        const guideline = await prisma.guideline.create({
            data: {
                title,
                content,
                category,
            },
        });

        res.status(201).json(guideline);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create guideline' });
    }
};

export const getGuidelines = async (req: Request, res: Response) => {
    try {
        const guidelines = await prisma.guideline.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(guidelines);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guidelines' });
    }
};

export const getGuidelineById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const guideline = await prisma.guideline.findUnique({
            where: { id },
        });
        if (!guideline) return res.status(404).json({ error: 'Guideline not found' });
        res.json(guideline);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guideline' });
    }
};

export const updateGuideline = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        const guideline = await prisma.guideline.update({
            where: { id },
            data: {
                title,
                content,
                category,
            },
        });

        res.json(guideline);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update guideline' });
    }
};

export const deleteGuideline = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.guideline.delete({
            where: { id },
        });

        res.json({ message: 'Guideline deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete guideline' });
    }
};