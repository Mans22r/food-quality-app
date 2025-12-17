'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'HOTEL_MANAGEMENT':
          router.push('/dashboard/hotel-management');
          break;
        case 'INSPECTOR':
          router.push('/dashboard/inspector');
          break;
        case 'KITCHEN_MANAGER':
          router.push('/dashboard/kitchen-manager');
          break;
        default:
          router.push('/login');
      }
    } else {
      // If no user, redirect to login
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
}