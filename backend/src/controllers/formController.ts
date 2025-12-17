import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const createForm = async (req: Request, res: Response) => {
    try {
        const { title, description, fields } = req.body;

        const form = await prisma.inspectionForm.create({
            data: {
                title,
                description,
                fields: {
                    create: fields.map((field: any, index: number) => ({
                        label: field.label,
                        fieldType: field.fieldType,
                        required: field.required,
                        options: field.options,
                        order: index,
                    })),
                },
            },
            include: { fields: true },
        });

        res.status(201).json(form);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create form' });
    }
};

export const getForms = async (req: Request, res: Response) => {
    try {
        const forms = await prisma.inspectionForm.findMany({
            where: { isActive: true },
            include: { fields: { orderBy: { order: 'asc' } } },
        });
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forms' });
    }
};

export const getFormById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const form = await prisma.inspectionForm.findUnique({
            where: { id },
            include: { fields: { orderBy: { order: 'asc' } } },
        });
        if (!form) return res.status(404).json({ error: 'Form not found' });
        res.json(form);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch form' });
    }
};
