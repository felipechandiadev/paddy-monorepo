import React from 'react';

interface ReportSummaryCardProps {
  title: string;
  value: string;
  hint?: string;
  className?: string;
}

const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({
  title,
  value,
  hint,
  className = '',
}) => {
  return (
    <div className={`rounded-lg border border-border bg-white p-4 print:border-neutral-300 print:rounded-none print:p-2.5 print:mb-2 print:mx-1 ${className}`}>
      <p className="text-xs uppercase tracking-wide text-neutral-500 print:text-[7px] print:text-neutral-700">{title}</p>
      <p className="mt-2 text-xl font-semibold text-foreground print:mt-1 print:text-[11px] print:font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500 print:mt-0.5 print:text-[7px] print:text-neutral-600">{hint}</p> : null}
    </div>
  );
};

export default ReportSummaryCard;
