'use client'
import React from 'react';
import { useState } from 'react';
import { calculateColumnStyles } from '../utils/columnStyles';
import type { DataGridColumn } from '../DataGrid';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import { formatGridDateTime, formatGridDate, formatKilogramsDisplay } from '../utils/formatGridCell';

interface BodyProps {
  columns?: DataGridColumn[];
  rows?: any[];
  filterMode?: boolean;
  screenWidth?: number;
  expandable?: boolean;
  expandedRowIds?: Set<string | number>;
  onToggleExpand?: (rowId: string | number) => void;
  expandableRowContent?: (row: any) => React.ReactNode;
  pinActionsColumn?: boolean;
  actionsColumnField?: string;
}

function cellJustify(column: DataGridColumn): string {
  const a =
    column.align ??
    (column.type === 'number' ||
    column.type === 'id' ||
    column.renderType === 'weightKg'
      ? 'right'
      : 'left');
  if (a === 'right') return 'justify-end text-right';
  if (a === 'center') return 'justify-center text-center';
  return 'justify-start text-left';
}

/** Etiqueta en español para valores de estado en badges (p. ej. recepciones). */
function badgeStatusLabel(raw: string): string {
  const key = raw.trim().toUpperCase();
  if (key === 'FINISHED') return 'Finalizado';
  if (key === 'ESPERA') return 'En espera';
  return raw || '—';
}

function renderDefaultCellInner(column: DataGridColumn, value: unknown): React.ReactNode {
  if (column.renderType === 'badge') {
    const s = String(value ?? '');
    const done = s.trim().toUpperCase() === 'FINISHED';
    const wait = s.trim().toUpperCase() === 'ESPERA';
    const label = badgeStatusLabel(s);
    return (
      <span
        className={`inline-flex max-w-full shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          done
            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/35 dark:text-emerald-100'
            : wait
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-100'
              : 'bg-muted text-muted-foreground'
        }`}
      >
        {label}
      </span>
    );
  }

  if (column.renderType === 'currency') {
    const n = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isNaN(n)) {
      return <span className="tabular-nums">—</span>;
    }
    return <span className="tabular-nums">{n.toLocaleString('es-CL')}</span>;
  }

  if (column.renderType === 'weightKg') {
    const text = formatKilogramsDisplay(value);
    return <span className="whitespace-nowrap tabular-nums">{text}</span>;
  }

  if (column.renderType === 'dateString') {
    return (
      <span className="whitespace-nowrap tabular-nums text-foreground/90">
        {formatGridDateTime(value)}
      </span>
    );
  }

  if (column.type === 'dateTime') {
    return (
      <span className="whitespace-nowrap tabular-nums text-foreground/90">
        {formatGridDateTime(value)}
      </span>
    );
  }

  if (column.type === 'date') {
    return (
      <span className="whitespace-nowrap tabular-nums text-foreground/90">
        {formatGridDate(value)}
      </span>
    );
  }

  if (column.type === 'number' || column.type === 'id') {
    const t = value !== null && value !== undefined ? String(value) : '—';
    return <span className="whitespace-nowrap tabular-nums">{t}</span>;
  }

  const t = value !== null && value !== undefined ? String(value) : '—';

  if (column.nowrap || column.mono) {
    return (
      <span
        className={`whitespace-nowrap text-foreground/95 ${column.mono ? 'font-mono text-xs uppercase' : 'font-normal'}`}
      >
        {t}
      </span>
    );
  }

  return (
    <span className="min-w-0 break-words text-foreground/95 leading-snug line-clamp-2">
      {t}
    </span>
  );
}

const bodyCellBase =
  'min-h-[40px] min-w-0 border-b border-border/70 px-3 py-2 text-sm flex items-center';

const Body: React.FC<BodyProps> = ({
  columns = [],
  rows = [],
  filterMode = false,
  screenWidth = 1024,
  expandable = false,
  expandedRowIds = new Set(),
  onToggleExpand,
  expandableRowContent,
  pinActionsColumn = false,
  actionsColumnField = 'actions',
}) => {
  const [hoveredRowId, setHoveredRowId] = useState<string | number | null>(null);
  const visibleColumns = columns.filter((c) => !c.hide);

  const computedStyles = calculateColumnStyles(columns, screenWidth);

  return (
    <div className="flex-1" data-test-id="data-grid-body">
      {rows.map((row, rowIndex) => {
        const rowId = row.id || rowIndex;
        const isExpanded = expandedRowIds.has(rowId);

        return (
          <React.Fragment key={rowId}>
            <div
              className="flex min-w-full items-stretch data-grid-row"
              style={{ minWidth: 'max-content' }}
              data-test-id="data-grid-row"
            >
              {expandable && (
                <div
                  className="flex h-auto min-h-[40px] w-10 min-w-[40px] items-center justify-center border-b border-border/70 px-1 py-1"
                  style={{
                    backgroundColor:
                      hoveredRowId === rowId ? 'var(--color-hover, #f5f5f5)' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredRowId(rowId)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  <IconButton
                    icon="expand_more"
                    variant="basic"
                    size="sm"
                    onClick={() => onToggleExpand?.(rowId)}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    ariaLabel={isExpanded ? 'Colapsar fila' : 'Expandir fila'}
                  />
                </div>
              )}
              {visibleColumns.map((column, colIndex) => {
                const rawValue = row[column.field];
                const style = computedStyles[colIndex];
                const isPinnedActionsColumn =
                  pinActionsColumn && column.field === actionsColumnField;
                const rowBackgroundColor =
                  hoveredRowId === rowId
                    ? 'var(--color-hover, #f5f5f5)'
                    : 'var(--color-background, #ffffff)';

                const cellStyle = {
                  ...style,
                  backgroundColor: rowBackgroundColor,
                  ...(isPinnedActionsColumn
                    ? {
                        position: 'sticky' as const,
                        right: 0,
                        zIndex: 8,
                        borderLeft: '1px solid var(--border, #e5e7eb)',
                        flex: '0 0 auto',
                      }
                    : {}),
                };

                const value = column.valueGetter
                  ? column.valueGetter({ row, value: rawValue, column, rowIndex })
                  : rawValue;

                const cellClass = `${bodyCellBase} ${cellJustify(column)}`;

                if (column.actionComponent) {
                  const ActionComponent = column.actionComponent;
                  return (
                    <div
                      key={`${column.field}-${rowId}`}
                      className={cellClass}
                      style={cellStyle}
                      onMouseEnter={() => setHoveredRowId(rowId)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <ActionComponent row={row} column={column} />
                    </div>
                  );
                }

                if (column.renderCell) {
                  return (
                    <div
                      key={`${column.field}-${rowId}`}
                      className={cellClass}
                      style={cellStyle}
                      onMouseEnter={() => setHoveredRowId(rowId)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <div className="min-w-0 overflow-hidden">
                        {column.renderCell({ row, value, column })}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${column.field}-${rowId}`}
                    className={cellClass}
                    style={cellStyle}
                    onMouseEnter={() => setHoveredRowId(rowId)}
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
                    <div className="min-w-0 max-w-full overflow-hidden">
                      {renderDefaultCellInner(column, value)}
                    </div>
                  </div>
                );
              })}
            </div>
            {expandable && isExpanded && expandableRowContent && (
              <div
                className="min-w-full overflow-hidden border-b border-border/70 bg-muted/40"
                style={{ minWidth: 'max-content' }}
                data-test-id="data-grid-expanded-row"
              >
                <div className="p-4">{expandableRowContent(row)}</div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Body;
