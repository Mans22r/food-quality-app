"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormById = exports.getForms = exports.createForm = void 0;
const database_1 = require("../config/database");
const createForm = async (req, res) => {
    try {
        const { title, description, fields } = req.body;
        const form = await database_1.prisma.inspectionForm.create({
            data: {
                title,
                description,
                fields: {
                    create: fields.map((field, index) => ({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create form' });
    }
};
exports.createForm = createForm;
const getForms = async (req, res) => {
    try {
        const forms = await database_1.prisma.inspectionForm.findMany({
            where: { isActive: true },
            include: { fields: { orderBy: { order: 'asc' } } },
        });
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch forms' });
    }
};
exports.getForms = getForms;
const getFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await database_1.prisma.inspectionForm.findUnique({
            where: { id },
            include: { fields: { orderBy: { order: 'asc' } } },
        });
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        res.json(form);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch form' });
    }
};
exports.getFormById = getFormById;
