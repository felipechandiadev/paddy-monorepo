'use client';

import React from 'react';
import { MonitorDisplay } from '@/features/logistics/components/MonitorDisplay';

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Logistics Monitor</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time truck tracking and status</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MonitorDisplay
          refreshInterval={5000}
          publicView={true}
        />
      </main>
    </div>
  );
}
