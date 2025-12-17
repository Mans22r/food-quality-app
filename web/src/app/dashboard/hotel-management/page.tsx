'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function HotelManagementDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then((data) => setReports(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Group reports by form type
  const reportsByForm = reports.reduce((acc, report) => {
    const formTitle = report.form?.title || 'Unknown Form';
    if (!acc[formTitle]) {
      acc[formTitle] = [];
    }
    acc[formTitle].push(report);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) return <div className="p-8">Loading reports...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hotel Management Dashboard</h1>
      <p className="text-gray-600 mb-6">Monitor all inspection reports across the hotel</p>
      <div className="mb-6">
        <Link href="/dashboard/guidelines" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Food Quality Guidelines
        </Link>
      </div>
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Hotel Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-2xl font-bold">{reports.length}</p>
            <p className="text-gray-600">Total Reports</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-2xl font-bold">
              {Object.keys(reportsByForm).length}
            </p>
            <p className="text-gray-600">Different Inspection Types</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-2xl font-bold">
              {reports.filter(r => r.status === 'SUBMITTED').length}
            </p>
            <p className="text-gray-600">Pending Review</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Evaluation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.form?.title || 'Unknown Form'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.inspector?.name || 'Unknown'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.aiEvaluation === 'GOOD' ? 'bg-green-100 text-green-800' : 
                    report.aiEvaluation === 'POOR' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.aiEvaluation || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/dashboard/reports/${report.id}`} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}