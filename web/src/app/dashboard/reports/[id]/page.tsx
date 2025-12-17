'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ReportDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
        api.get(`/reports/${id}`)
            .then((data) => setReport(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }
  }, [id]);

  const handleApprove = async () => {
      if (!confirm('Are you sure you want to approve this report?')) return;
      setApproving(true);
      try {
          await api.put(`/reports/${id}/approve`, {});
          setReport({ ...report, status: 'APPROVED', approvedAt: new Date() });
      } catch (err) {
          alert('Failed to approve report');
      } finally {
          setApproving(false);
      }
  };

  if (loading) return <div className="p-8">Loading report...</div>;
  if (!report) return <div className="p-8">Report not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-3xl font-bold">{report.form?.title}</h1>
            <p className="text-gray-500">Submitted by {report.inspector?.name} on {new Date(report.submittedAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full font-bold ${
                report.aiEvaluation === 'GOOD' ? 'bg-green-100 text-green-800' : 
                report.aiEvaluation === 'POOR' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
                AI: {report.aiEvaluation}
            </span>
             <span className={`px-3 py-1 rounded-full font-bold ${
                report.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {report.status}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Inspection Details</h2>
                <dl className="space-y-4">
                    {report.fields?.map((item: any) => (
                        <div key={item.id}>
                            <dt className="text-sm font-medium text-gray-500">{item.field?.label}</dt>
                            <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded shadow border border-indigo-100">
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">AI Summary</h2>
                 <p className="text-indigo-800 text-sm leading-relaxed">
                    {report.aiSummary || 'No summary available.'}
                </p>
            </div>

            {/* Only show Approve button if user is admin and report is not already approved */}
            {user?.role === 'ADMIN' && report.status !== 'APPROVED' && (
                <button 
                    onClick={handleApprove}
                    disabled={approving}
                    className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 shadow-md transition-colors"
                >
                    {approving ? 'Approving...' : 'Approve Report'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
