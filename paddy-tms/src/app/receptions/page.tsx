import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { getTruckReceptionsGridAction } from '@/actions/truckReceptionActions';
import { TmsAppLayout } from '@/components/layout/TmsAppLayout';
import { ReceptionsDataGrid } from './ui/ReceptionsDataGrid';

type SearchParams = Record<string, string | string[] | undefined>;

function parseIntParam(v: string | string[] | undefined, fallback: number): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = parseInt(s ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

export default async function ReceptionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?redirect=/receptions');
  }

  const sp = await searchParams;
  const limit = Math.min(Math.max(parseIntParam(sp.limit, 25), 1), 500);
  const page = Math.max(parseIntParam(sp.page, 1), 1);
  const offset = (page - 1) * limit;

  const { rows, total } = await getTruckReceptionsGridAction({ limit, offset });

  return (
    <TmsAppLayout>
      <main className="flex-1 p-6">
        <ReceptionsDataGrid rows={rows} totalRows={total} />
      </main>
    </TmsAppLayout>
  );
}
