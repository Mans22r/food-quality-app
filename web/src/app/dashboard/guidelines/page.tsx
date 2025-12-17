'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Guideline {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
}

export default function GuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/guidelines')
      .then((data) => setGuidelines(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading guidelines...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Food Quality Guidelines</h1>
      </div>
      
      {guidelines.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No guidelines available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {guidelines.map((guideline) => (
            <div key={guideline.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{guideline.title}</h2>
                  {guideline.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {guideline.category}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(guideline.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="prose max-w-none mt-4">
                <p>{guideline.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}