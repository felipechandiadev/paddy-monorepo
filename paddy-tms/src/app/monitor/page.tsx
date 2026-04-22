'use client';

import React from 'react';
import { MonitorTopBar } from '@/features/logistics/components/MonitorTopBar';
import { MonitorDisplay } from '@/features/logistics/components/MonitorDisplay';
import { useMonitorQueueSocket } from '@/features/logistics/hooks/useMonitorQueueSocket';

export default function MonitorPage() {
  const { state, connected, error } = useMonitorQueueSocket();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MonitorTopBar connected={connected} />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6">
        <MonitorDisplay state={state} error={error} />
      </main>
    </div>
  );
}
