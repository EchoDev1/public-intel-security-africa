'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && (user.email?.toLowerCase() === 'ekpendudakore@gmail.com' || user.role === 'admin')) {
      router.replace('/admin');
    } else {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-mono text-slate-300">Routing account session...</span>
      </div>
    </div>
  );
}
