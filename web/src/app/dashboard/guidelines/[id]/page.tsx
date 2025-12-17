'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';

interface Guideline {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
}

export default function GuidelineDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/guidelines/${id}`)
        .then((data) => setGuideline(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8">Loading guideline...</div>;
  if (!guideline) return <div className="p-8">Guideline not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Guidelines
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{guideline.title}</h1>
            {guideline.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {guideline.category}
              </span>
            )}
          </div>
          <span className="text-gray-500">
            {new Date(guideline.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="prose max-w-none mt-8">
          <p className="text-gray-700 leading-relaxed">{guideline.content}</p>
        </div>
      </div>
    </div>
  );
}