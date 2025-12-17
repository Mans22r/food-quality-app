'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import InspectionFormBuilder, { FormField } from '@/components/forms/InspectionFormBuilder'; // Ensure correct import path
import { useParams } from 'next/navigation';

export default function InspectionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
       api.get(`/forms/${id}`)
      .then((data) => setForm(data))
      .catch((err) => setError('Failed to load form'))
      .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8">Loading form...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!form) return <div className="p-8">Form not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      <p className="text-gray-600 mb-6">{form.description}</p>
      
      <InspectionFormBuilder formId={id} fields={form.fields} />
    </div>
  );
}
