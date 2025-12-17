'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
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

export default function EditFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const [form, setForm] = useState<InspectionForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/forms/${formId}`);
      setForm(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch form');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading form...</div>;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Form not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Form: {form.title}</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description || ''}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({...form, isActive: e.target.checked})}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active
          </label>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
        {form.fields.length > 0 ? (
          <div className="space-y-4">
            {form.fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...form.fields];
                        newFields[index] = {...field, label: e.target.value};
                        setForm({...form, fields: newFields});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={field.fieldType}
                      onChange={(e) => {
                        const newFields = [...form.fields];
                        newFields[index] = {...field, fieldType: e.target.value};
                        setForm({...form, fields: newFields});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="TEXT">Text</option>
                      <option value="TEXTAREA">Textarea</option>
                      <option value="NUMBER">Number</option>
                      <option value="SELECT">Select</option>
                      <option value="RADIO">Radio</option>
                      <option value="CHECKBOX">Checkbox</option>
                      <option value="DATE">Date</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center">
                      <input
                        id={`required-${field.id}`}
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const newFields = [...form.fields];
                          newFields[index] = {...field, required: e.target.checked};
                          setForm({...form, fields: newFields});
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No fields in this form yet.</p>
        )}
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={() => alert('Form update feature coming soon!')}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}