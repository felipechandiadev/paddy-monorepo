import { fetchTruckReceptionsGrid } from '@/features/logistics-trucks/actions/grid.actions';
import { TruckReceptionsCargoDataGrid } from './ui/TruckReceptionsCargoDataGrid';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function parseIntParam(v: string | string[] | undefined, fallback: number): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = parseInt(s ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

function pickQueryString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s === '' ? undefined : s;
}

export default async function TruckReceptionsCargoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const limit = Math.min(Math.max(parseIntParam(sp.limit, 25), 1), 500);
  const page = Math.max(parseIntParam(sp.page, 1), 1);
  const offset = (page - 1) * limit;

  const { rows, total } = await fetchTruckReceptionsGrid({
    limit,
    offset,
    search: pickQueryString(sp.search),
    filters: pickQueryString(sp.filters),
    sort: pickQueryString(sp.sort),
    sortField: pickQueryString(sp.sortField),
  });

  return (
    <div className="p-6">
      <TruckReceptionsCargoDataGrid rows={rows} totalRows={total} limit={limit} />
    </div>
  );
}
