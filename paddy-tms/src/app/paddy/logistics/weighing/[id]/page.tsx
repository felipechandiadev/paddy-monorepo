'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { fetchTruckById } from '@/features/logistics/services/truckService';
import { fetchTruckReceptions } from '@/features/logistics/actions/truck.action';
import { Truck, TruckReception } from '@/features/logistics/types/logistics.types';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TruckDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [truck, setTruck] = React.useState<Truck | null>(null);
  const [receptions, setReceptions] = React.useState<TruckReception[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/paddy/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [truckData, receptionsData] = await Promise.all([
          fetchTruckById(params.id),
          fetchTruckReceptions(params.id),
        ]);

        setTruck(truckData);
        if (receptionsData.success) {
          setReceptions(receptionsData.receptions || []);
        }
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load truck details';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [params.id, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error || 'Truck not found'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{truck.plate}</h1>
          <p className="text-sm text-gray-600 mt-1">Truck Details & Reception History</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Truck Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Truck Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">License Plate</p>
              <p className="text-lg font-semibold text-gray-900">{truck.plate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`
                inline-block px-3 py-1 rounded-full text-sm font-medium mt-1
                ${truck.status === 'completed' ? 'bg-green-100 text-green-800' :
                  truck.status === 'weighing' ? 'bg-blue-100 text-blue-800' :
                  truck.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'}
              `}>
                {truck.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver Name</p>
              <p className="text-lg font-semibold text-gray-900">{truck.driverName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver Document</p>
              <p className="text-lg font-semibold text-gray-900">{truck.driverDocument}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entry Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(truck.entryTime).toLocaleString()}
              </p>
            </div>
            {truck.exitTime && (
              <div>
                <p className="text-sm text-gray-600">Exit Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(truck.exitTime).toLocaleString()}
                </p>
              </div>
            )}
            {truck.weight && (
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-lg font-semibold text-gray-900">{truck.weight} kg</p>
              </div>
            )}
          </div>
        </div>

        {/* Reception History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reception History</h2>

          {receptions.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No receptions recorded yet</p>
          ) : (
            <div className="space-y-4">
              {receptions.map((reception, index) => (
                <div key={reception.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                      Reception #{index + 1}
                    </span>
                    <p className="text-sm text-gray-600">
                      {new Date(reception.recordedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Weight</p>
                      <p className="font-semibold text-gray-900">{reception.weight} kg</p>
                    </div>
                    {reception.moistureLevel !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Moisture Level</p>
                        <p className="font-semibold text-gray-900">{reception.moistureLevel}%</p>
                      </div>
                    )}
                    {reception.quality && (
                      <div>
                        <p className="text-xs text-gray-600">Quality</p>
                        <p className="font-semibold text-gray-900">{reception.quality}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-600">Recorded By</p>
                      <p className="font-semibold text-gray-900">{reception.recordedBy}</p>
                    </div>
                  </div>

                  {reception.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">Notes</p>
                      <p className="text-sm text-gray-700">{reception.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
