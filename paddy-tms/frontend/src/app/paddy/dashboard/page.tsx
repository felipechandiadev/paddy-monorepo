'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { useLogisticsData } from '@/features/logistics/hooks/useLogisticsData';
import { useLogistics } from '@/features/logistics/hooks/useLogistics';
import { logout } from '@/features/logistics/services/authService';
import { CurrentTruckDisplay } from '@/features/logistics/components/CurrentTruckDisplay';
import { QueueList } from '@/features/logistics/components/QueueList';
import { MonitorDisplay } from '@/features/logistics/components/MonitorDisplay';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { trucks, loading: dataLoading } = useLogisticsData(isAuthenticated);
  const { state } = useLogistics();
  const [selectedTruck, setSelectedTruck] = useState<string | undefined>();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/paddy/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/paddy/auth/login');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const currentTruck = trucks.find(t => t.status === 'weighing') || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paddy TMS Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Truck */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Truck</h2>
                <CurrentTruckDisplay
                  truck={currentTruck}
                  isLoading={dataLoading}
                />
              </div>

              {/* Queue List */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Queue</h2>
                <QueueList
                  trucks={trucks}
                  selectedTruckId={selectedTruck}
                  onSelectTruck={(truck) => setSelectedTruck(truck.id)}
                  maxDisplay={5}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Monitor */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h2>
            <MonitorDisplay
              refreshInterval={5000}
              publicView={false}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Trucks</p>
            <p className="text-2xl font-bold text-gray-900">{trucks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {trucks.filter(t => t.status === 'weighing').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {trucks.filter(t => t.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {trucks.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
