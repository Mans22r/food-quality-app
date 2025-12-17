export interface User {
    id: string;
    email: string;
    name: string;
    role: 'INSPECTOR' | 'KITCHEN_MANAGER' | 'HOTEL_MANAGEMENT' | 'ADMIN';
}

export interface InspectionForm {
    id: string;
    title: string;
    description: string;
    fields: FormField[];
}

export interface FormField {
    id: string;
    label: string;
    fieldType: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'SELECT' | 'RADIO' | 'CHECKBOX' | 'DATE';
    required: boolean;
    options?: unknown;
}

export interface InspectionReport {
    id: string;
    submittedAt: string;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    aiSummary?: string;
    aiEvaluation?: 'GOOD' | 'AVERAGE' | 'POOR';
    approvedAt?: string;
    inspector?: { name: string };
    form?: { title: string };
    fields?: ReportField[];
}

export interface ReportField {
    id: string;
    value: string;
    field?: FormField;
}

export interface DashboardStats {
    totalReports: number;
    approvedReports: number;
    pendingReports: number;
    goodEvaluations: number;
    recentReports: InspectionReport[];
}
