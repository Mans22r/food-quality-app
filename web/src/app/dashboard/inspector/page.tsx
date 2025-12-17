'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface InspectionForm {
  id: string;
  title: string;
  description: string;
}

export default function InspectorDashboard() {
  const [forms, setForms] = useState<InspectionForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/forms')
      .then((data) => setForms(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading forms...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inspector Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
            <p className="text-gray-600 mb-4">{form.description}</p>
            <Link 
              href={`/dashboard/inspector/forms/${form.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Inspection
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
