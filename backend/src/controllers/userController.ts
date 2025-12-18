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

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (!Object.values(Role).includes(role as Role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role: role as Role },
            select: { id: true, email: true, name: true, role: true },
        });

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Prevent deleting the last admin
        const adminCount = await prisma.user.count({
            where: { role: Role.ADMIN }
        });

        const userToDelete = await prisma.user.findUnique({
            where: { id }
        });

        if (userToDelete?.role === Role.ADMIN && adminCount <= 1) {
            return res.status(400).json({ error: 'Cannot delete the last admin user' });
        }

        // First, delete audit logs associated with the user
        await prisma.auditLog.deleteMany({
            where: { userId: id }
        });

        // Then delete the user
        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};