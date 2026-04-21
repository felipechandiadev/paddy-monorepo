'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al login automáticamente
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
        <h1 className="text-3xl font-bold text-white mb-2">Paddy TMS</h1>
        <p className="text-blue-100">Truck Management System</p>
        <p className="text-blue-200 text-sm mt-4">Cargando...</p>
      </div>
    </div>
  );
}
