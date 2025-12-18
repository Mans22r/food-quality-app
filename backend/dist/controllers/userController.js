"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.createUser = void 0;
const database_1 = require("../config/database");
const password_1 = require("../utils/password");
const types_1 = require("../types");
const createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const existingUser = await database_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role,
            },
        });
        res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
const getAllUsers = async (req, res) => {
    try {
        const users = await database_1.prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        // Validate role
        if (!Object.values(types_1.Role).includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const user = await database_1.prisma.user.update({
            where: { id },
            data: { role: role },
            select: { id: true, email: true, name: true, role: true },
        });
        res.json({ message: 'User role updated successfully', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent deleting the last admin
        const adminCount = await database_1.prisma.user.count({
            where: { role: types_1.Role.ADMIN }
        });
        const userToDelete = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (userToDelete?.role === types_1.Role.ADMIN && adminCount <= 1) {
            return res.status(400).json({ error: 'Cannot delete the last admin user' });
        }
        // First, delete audit logs associated with the user
        await database_1.prisma.auditLog.deleteMany({
            where: { userId: id }
        });
        // Then delete the user
        await database_1.prisma.user.delete({
            where: { id }
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
