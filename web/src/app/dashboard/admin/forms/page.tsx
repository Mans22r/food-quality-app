'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FormField {
  id: string;
  label: string;
  fieldType: string;
  required: boolean;
  options?: any;
  order: number;
}

interface InspectionForm {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fields: FormField[];
}

export default function FormsManagementPage() {
  const [forms, setForms] = useState<InspectionForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await api.get('/forms');
      setForms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch forms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFormStatus = async (formId: string, currentStatus: boolean) => {
    try {
      // Note: This would require a backend endpoint to update form status
      // For now, we'll just show an alert
      alert(`Would toggle form ${formId} status to ${!currentStatus}`);
      // In a real implementation, you would:
      // await api.put(`/forms/${formId}`, { isActive: !currentStatus });
      // fetchForms(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update form status');
    }
  };

  if (loading) return <div className="p-8">Loading forms...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forms Management</h1>
        <Button onClick={() => alert('Form creation feature coming soon!')}>
          Create New Form
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.map((form) => (
              <tr key={form.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{form.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{form.description || 'No description'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{form.fields.length} fields</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    form.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleFormStatus(form.id, form.isActive)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    {form.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link href={`/dashboard/admin/forms/${form.id}`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {forms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No forms found.</p>
          </div>
        )}
      </div>
    </div>
  );
}