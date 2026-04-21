'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { useLogisticsData } from '@/features/logistics/hooks/useLogisticsData';
import { useLogistics } from '@/features/logistics/hooks/useLogistics';
import { logout } from '@/features/logistics/services/authService';
import { registerWeighing } from '@/features/logistics/actions/truck.action';
import { WeighingForm } from '@/features/logistics/components/WeighingForm';
import { CurrentTruckDisplay } from '@/features/logistics/components/CurrentTruckDisplay';
import { QueueList } from '@/features/logistics/components/QueueList';
import { WeighingData } from '@/features/logistics/types/logistics.types';

export default function WeighingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { trucks, loading: dataLoading } = useLogisticsData(isAuthenticated);
  const { state, setError } = useLogistics();
  const [selectedTruck, setSelectedTruck] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleWeighingSubmit = async (data: WeighingData) => {
    setIsSubmitting(true);
    try {
      const result = await registerWeighing(data);
      if (result.success) {
        setError(null);
        setSelectedTruck(undefined);
        router.refresh();
      } else {
        setError(result.error || 'Failed to register weighing');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error submitting weighing';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
  const selectedTruckData = selectedTruck ? trucks.find(t => t.id === selectedTruck) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Weighing Panel</h1>
              <p className="text-sm text-gray-600 mt-1">Operator: {user?.name}</p>
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
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Truck */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Truck</h2>
              <CurrentTruckDisplay
                truck={currentTruck}
                isLoading={dataLoading}
              />
            </div>

            {/* Queue */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Next in Queue</h2>
              <QueueList
                trucks={trucks}
                selectedTruckId={selectedTruck}
                onSelectTruck={(truck) => setSelectedTruck(truck.id)}
                maxDisplay={5}
              />
            </div>
          </div>

          {/* Right Column - Weighing Form */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weighing Form</h2>

            {selectedTruckData ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Selected Truck</p>
                  <p className="text-lg font-bold text-blue-900 mt-1">{selectedTruckData.plate}</p>
                  <p className="text-sm text-blue-700 mt-2">
                    Driver: {selectedTruckData.driverName}
                  </p>
                </div>

                <WeighingForm
                  truckId={selectedTruckData.id}
                  onSubmit={handleWeighingSubmit}
                  onCancel={() => setSelectedTruck(undefined)}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-600 text-lg font-medium">No truck selected</p>
                <p className="text-gray-500 text-sm mt-2">
                  Select a truck from the queue to begin weighing
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
