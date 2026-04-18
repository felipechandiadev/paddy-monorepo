import React from 'react';

type PrintableTableAlign = 'left' | 'center' | 'right';

export interface PrintableReportTableColumn<Row> {
  key: string;
  label: string;
  align?: PrintableTableAlign;
  render: (row: Row) => React.ReactNode;
}

interface PrintableReportTableProps<Row> {
  title: string;
  subtitle?: string;
  columns: PrintableReportTableColumn<Row>[];
  rows: Row[];
  emptyMessage?: string;
  showContainerBorder?: boolean;
}

function getPrintableTableAlignClass(align: PrintableTableAlign = 'left'): string {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'right') {
    return 'text-right';
  }

  return 'text-left';
}

function PrintableReportTable<Row>({
  title,
  subtitle,
  columns,
  rows,
  emptyMessage = 'Sin registros para mostrar.',
  showContainerBorder = true,
}: PrintableReportTableProps<Row>) {
  const containerBorderClass = showContainerBorder ? 'border border-neutral-200' : '';

  return (
    <section
      className={`overflow-hidden rounded-xl ${containerBorderClass} bg-white print:break-inside-avoid print:rounded-none`}
    >
      <div className="border-b border-neutral-200 px-2 py-1 print:px-1 print:py-0.5">
        <h3 className="text-base font-semibold text-neutral-900 print:text-[9px] print:font-bold">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-neutral-600 print:text-[7px] print:mt-0.5 print:text-neutral-700">{subtitle}</p>
        ) : null}
      </div>

      <div className="overflow-x-auto print:overflow-visible">
        <table className="min-w-full border-collapse text-sm print:text-[8px]">
          <thead>
            <tr className="bg-neutral-100 text-[11px] uppercase tracking-wide text-neutral-700 print:bg-gray-100 print:text-[7px] print:font-bold">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-neutral-200 px-1 py-1 font-semibold print:px-0.5 print:py-0.5 print:border-b-gray-300 ${getPrintableTableAlignClass(
                    column.align,
                  )}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index} className="border-b border-neutral-100 align-top last:border-b-0 print:border-b-gray-200">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-1 py-1 text-neutral-800 print:px-0.5 print:py-0.5 print:text-neutral-900 print:leading-tight ${getPrintableTableAlignClass(
                        column.align,
                      )}`}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-1 py-3 text-center text-sm text-neutral-500 print:py-1 print:text-[7px] print:text-neutral-600"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PrintableReportTable;
