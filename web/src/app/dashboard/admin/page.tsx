'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading stats...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Reports</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalReports}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Approved</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats?.approvedReports}</p>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pendingReports}</p>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">High Quality</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.goodEvaluations}</p>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Quick Actions */}
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Management</h2>
            <div className="flex flex-wrap gap-4">
                <Link href="/dashboard/admin/users" className="text-blue-600 hover:underline">Manage Users</Link>
                <Link href="/dashboard/admin/forms" className="text-blue-600 hover:underline">Manage Forms</Link>
                <Link href="/dashboard/admin/reports" className="text-blue-600 hover:underline">Manage Reports</Link>
                <Link href="/dashboard/admin/guidelines" className="text-blue-600 hover:underline">Manage Guidelines</Link>
                <Link href="/dashboard/admin/guidelines/new" className="text-blue-600 hover:underline">Add New Guideline</Link>
            </div>
         </div>

         {/* Recent Activity */}
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
            <ul className="divide-y divide-gray-100">
                {stats?.recentReports?.map((report: any) => (
                    <li key={report.id} className="py-3 flex justify-between items-center">
                         <span className="text-gray-800">{report.form?.title}</span>
                         <div className="flex items-center space-x-4">
                            <span className="text-gray-500 text-sm">{new Date(report.submittedAt).toLocaleDateString()}</span>
                            <Link href={`/dashboard/reports/${report.id}`} className="text-blue-600 hover:underline text-sm">
                                View Details
                            </Link>
                         </div>
                    </li>
                ))}
            </ul>
         </div>
       </div>
    </div>
  );
}
