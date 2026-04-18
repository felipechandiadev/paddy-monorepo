'use client';

import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface InventoryBalanceBarChartProps {
  deposito: number;
  propio: number;
  numberFormatter: Intl.NumberFormat;
}

interface BarItem {
  key: 'deposito' | 'propio';
  label: string;
  value: number;
  positiveColor: string;
  negativeColor: string;
}

const InventoryBalanceBarChart: React.FC<InventoryBalanceBarChartProps> = ({
  deposito,
  propio,
  numberFormatter,
}) => {
  const items = useMemo<BarItem[]>(
    () => [
      {
        key: 'deposito',
        label: 'Depósito',
        value: deposito,
        positiveColor: '#10b981',
        negativeColor: '#e11d48',
      },
      {
        key: 'propio',
        label: 'Propio',
        value: propio,
        positiveColor: '#3b82f6',
        negativeColor: '#f59e0b',
      },
    ],
    [deposito, propio],
  );

  const maxAbsoluteValue = useMemo(
    () => Math.max(1, ...items.map((item) => Math.max(0, item.value))),
    [items],
  );

  const yDomain = useMemo(
    () => [0, maxAbsoluteValue * 1.2] as [number, number],
    [maxAbsoluteValue],
  );

  return (
    <section className="rounded-xl border border-neutral-200 bg-white px-4 py-4 print:hidden">
      <h3 className="text-base font-semibold text-neutral-900">
        Saldos del Mes
      </h3>
      <p className="mt-1 text-sm text-neutral-600">
        Kilogramos en Depósito y Propio al cierre del período seleccionado.
      </p>

      <div className="mt-4 h-72 w-full rounded-md bg-neutral-50 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} margin={{ top: 8, right: 8, left: 70, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#6b7280" />
            <YAxis
              domain={yDomain}
              tickFormatter={(value) => numberFormatter.format(Math.round(value))}
              stroke="#6b7280"
              label={{ value: 'kg', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: '12px' } }}
            />
            <Tooltip 
              formatter={(value: any) => [numberFormatter.format(value) + ' kg', 'Saldo']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="value" name="Saldo" radius={[8, 8, 0, 0]}>
              {items.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.value >= 0 ? entry.positiveColor : entry.negativeColor}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-neutral-600">Depósito (kg)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
          <span className="text-neutral-600">Propio (kg)</span>
        </div>
      </div>
    </section>
  );
};

export default InventoryBalanceBarChart;