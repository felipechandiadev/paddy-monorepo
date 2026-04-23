import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { getTruckDispatchesGridAction } from '@/actions/truckDispatchActions';
import { TmsAppLayout } from '@/components/layout/TmsAppLayout';
import { DespachosDataGrid } from '../ui/DespachosDataGrid';

type SearchParams = Record<string, string | string[] | undefined>;

function parseIntParam(v: string | string[] | undefined, fallback: number): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = parseInt(s ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

function pickQueryString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s === '' ? undefined : s;
}

export default async function DespachosListaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?redirect=/despachos/lista');
  }

  const sp = await searchParams;
  const limit = Math.min(Math.max(parseIntParam(sp.limit, 25), 1), 500);
  const page = Math.max(parseIntParam(sp.page, 1), 1);
  const offset = (page - 1) * limit;

  const { rows, total } = await getTruckDispatchesGridAction({
    limit,
    offset,
    search: pickQueryString(sp.search),
    filters: pickQueryString(sp.filters),
    sort: pickQueryString(sp.sort),
    sortField: pickQueryString(sp.sortField),
  });

  return (
    <TmsAppLayout>
      <main className="flex-1 p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Despachos</h1>
          <Link
            href="/despachos"
            className="btn-text cursor-pointer px-4 py-2 text-sm inline-flex items-center justify-center rounded-md w-fit"
          >
            Pesaje despacho
          </Link>
        </div>
        <DespachosDataGrid rows={rows} totalRows={total} />
      </main>
    </TmsAppLayout>
  );
}
