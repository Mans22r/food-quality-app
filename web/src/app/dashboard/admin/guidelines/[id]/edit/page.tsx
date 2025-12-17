'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

interface Guideline {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
}

export default function EditGuidelinePage() {
  const params = useParams();
  const id = params?.id as string;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      api.get(`/guidelines/${id}`)
        .then((data: Guideline) => {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category || '');
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.put(`/guidelines/${id}`, { title, content, category });
      router.push('/dashboard/admin/guidelines');
      router.refresh();
    } catch (err) {
      alert('Failed to update guideline');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading guideline...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => router.back()} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Guidelines
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Guideline</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Guideline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}