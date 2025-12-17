'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export interface FormField {
  id: string;
  label: string;
  fieldType: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'SELECT' | 'RADIO' | 'CHECKBOX' | 'DATE';
  required: boolean;
  options?: any; // JSON
}

interface Props {
  formId: string;
  fields: FormField[];
}

export default function InspectionFormBuilder({ formId, fields }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await api.post('/reports', {
        formId,
        data,
      });
      alert('Report submitted successfully!');
      router.push('/dashboard/inspector');
    } catch (error) {
      console.error(error);
      alert('Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label className="font-medium mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.fieldType === 'TEXT' && (
            <input 
              {...register(field.id, { required: field.required })}
              className="border p-2 rounded"
            />
          )}
          
          {field.fieldType === 'TEXTAREA' && (
            <textarea 
              {...register(field.id, { required: field.required })}
              className="border p-2 rounded"
              rows={4}
            />
          )}

           {field.fieldType === 'NUMBER' && (
            <input 
              type="number"
              {...register(field.id, { required: field.required })}
              className="border p-2 rounded"
            />
          )}

           {field.fieldType === 'DATE' && (
            <input 
              type="date"
              {...register(field.id, { required: field.required })}
              className="border p-2 rounded"
            />
          )}

          {field.fieldType === 'SELECT' && field.options && (
             <select {...register(field.id, { required: field.required })} className="border p-2 rounded">
                <option value="">Select...</option>
                {(field.options as string[]).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
             </select>
          )}

          {errors[field.id] && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
      ))}

      <button 
        type="submit" 
        disabled={submitting}
        className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
