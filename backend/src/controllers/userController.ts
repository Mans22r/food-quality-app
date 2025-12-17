import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { Role } from '../types';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role as Role,
            },
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
