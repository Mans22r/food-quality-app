import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await hashPassword('admin123');
    const inspectorPassword = await hashPassword('inspector123');
    const kitchenManagerPassword = await hashPassword('kitchen123');
    const hotelManagementPassword = await hashPassword('hotel123');

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });

    // Create Inspector
    const inspector = await prisma.user.upsert({
        where: { email: 'inspector@example.com' },
        update: {},
        create: {
            email: 'inspector@example.com',
            name: 'Inspector User',
            password: inspectorPassword,
            role: Role.INSPECTOR,
        },
    });

    // Create Kitchen Manager
    const kitchenManager = await prisma.user.upsert({
        where: { email: 'kitchen@example.com' },
        update: {},
        create: {
            email: 'kitchen@example.com',
            name: 'Kitchen Manager User',
            password: kitchenManagerPassword,
            role: Role.KITCHEN_MANAGER,
        },
    });

    // Create Hotel Management
    const hotelManagement = await prisma.user.upsert({
        where: { email: 'hotel@example.com' },
        update: {},
        create: {
            email: 'hotel@example.com',
            name: 'Hotel Management User',
            password: hotelManagementPassword,
            role: Role.HOTEL_MANAGEMENT,
        },
    });

    // Create sample forms
    // First check if forms already exist
    const existingForms = await prisma.inspectionForm.findMany({
        where: {
            title: {
                in: ['Daily Kitchen Inspection', 'Weekly Equipment Check']
            }
        }
    });

    let dailyKitchenForm, weeklyEquipmentForm;
    
    if (existingForms.length === 0) {
        dailyKitchenForm = await prisma.inspectionForm.create({
            data: {
                title: 'Daily Kitchen Inspection',
                description: 'Standard daily inspection checklist for kitchen facilities',
                isActive: true,
                fields: {
                    create: [
                        {
                            label: 'Temperature Check',
                            fieldType: 'NUMBER',
                            required: true,
                            order: 0,
                        },
                        {
                            label: 'Cleanliness Rating',
                            fieldType: 'SELECT',
                            required: true,
                            options: ['Excellent', 'Good', 'Fair', 'Poor'],
                            order: 1,
                        },
                        {
                            label: 'Comments',
                            fieldType: 'TEXTAREA',
                            required: false,
                            order: 2,
                        },
                    ],
                },
            },
            include: { fields: true },
        });

        weeklyEquipmentForm = await prisma.inspectionForm.create({
            data: {
                title: 'Weekly Equipment Check',
                description: 'Comprehensive equipment inspection for kitchen appliances',
                isActive: true,
                fields: {
                    create: [
                        {
                            label: 'Equipment Name',
                            fieldType: 'TEXT',
                            required: true,
                            order: 0,
                        },
                        {
                            label: 'Last Service Date',
                            fieldType: 'DATE',
                            required: false,
                            order: 1,
                        },
                        {
                            label: 'Operational Status',
                            fieldType: 'RADIO',
                            required: true,
                            options: ['Working', 'Needs Repair', 'Out of Order'],
                            order: 2,
                        },
                        {
                            label: 'Maintenance Notes',
                            fieldType: 'TEXTAREA',
                            required: false,
                            order: 3,
                        },
                    ],
                },
            },
            include: { fields: true },
        });
    } else {
        console.log('Sample forms already exist, skipping creation');
        // Fetch the existing forms for logging
        dailyKitchenForm = await prisma.inspectionForm.findFirst({
            where: { title: 'Daily Kitchen Inspection' },
            include: { fields: true }
        });
        weeklyEquipmentForm = await prisma.inspectionForm.findFirst({
            where: { title: 'Weekly Equipment Check' },
            include: { fields: true }
        });
    }

    console.log({ admin, inspector, kitchenManager, hotelManagement, dailyKitchenForm, weeklyEquipmentForm });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
