'use client';

import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './InventoryBalanceBarChart.module.css';

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

  // Renderizado estático para impresión
  const renderPrintChart = () => {
    const chartWidth = 280;
    const chartHeight = 100;
    const padding = { top: 10, right: 10, left: 50, bottom: 30 };
    
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    
    const yScale = plotHeight / (maxAbsoluteValue * 1.2);
    const barWidth = plotWidth / items.length / 2;
    const barGap = (plotWidth / items.length - barWidth) / 2;
    
    return (
      <svg width={chartWidth} height={chartHeight} className={styles.printSvg}>
        {/* Y Axis Line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={chartHeight - padding.bottom}
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
        
        {/* X Axis Line */}
        <line
          x1={padding.left}
          y1={chartHeight - padding.bottom}
          x2={chartWidth - padding.right}
          y2={chartHeight - padding.bottom}
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
        
        {/* Y Axis Label */}
        <text
          x={padding.left - 5}
          y={chartHeight - padding.bottom + 12}
          fontSize="7"
          fill="#6b7280"
          textAnchor="end"
        >
          0
        </text>
        
        <text
          x={padding.left - 5}
          y={padding.top + 5}
          fontSize="7"
          fill="#6b7280"
          textAnchor="end"
        >
          {numberFormatter.format(Math.round(maxAbsoluteValue * 1.2))}
        </text>
        
        {/* Bars */}
        {items.map((item, idx) => {
          const barHeight = Math.max(0, item.value * yScale);
          const x = padding.left + idx * (plotWidth / items.length) + barGap;
          const y = chartHeight - padding.bottom - barHeight;
          const color = item.value >= 0 ? item.positiveColor : item.negativeColor;
          
          return (
            <React.Fragment key={item.key}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight - padding.bottom + 12}
                fontSize="7"
                fill="#6b7280"
                textAnchor="middle"
              >
                {item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 2}
                fontSize="6"
                fill="#111827"
                textAnchor="middle"
                fontWeight="bold"
              >
                {numberFormatter.format(Math.round(item.value))}
              </text>
            </React.Fragment>
          );
        })}
        
        {/* Legend */}
        <text x={70} y={chartHeight - 2} fontSize="6" fill="#10b981" fontWeight="bold">
          ■ Depósito
        </text>
        <text x={130} y={chartHeight - 2} fontSize="6" fill="#3b82f6" fontWeight="bold">
          ■ Propio
        </text>
      </svg>
    );
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Saldos del Mes</h3>
      <p className={styles.description}>
        Kilogramos en Depósito y Propio al cierre del período seleccionado.
      </p>

      {/* Web Chart (hidden in print) */}
      <div className={styles.chartContainer + ' hidden print:hidden'}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} margin={{ top: 8, right: 8, left: 70, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#6b7280" />
            <YAxis
              domain={[0, maxAbsoluteValue * 1.2]}
              tickFormatter={(value) => numberFormatter.format(Math.round(value))}
              stroke="#6b7280"
            />
            <Tooltip 
              formatter={(value: any) => [numberFormatter.format(value) + ' kg', 'Saldo']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend wrapperStyle={{ paddingTop: '12px' }} />
            <Bar dataKey="value" name="Saldo (kg)" radius={[8, 8, 0, 0]}>
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

      {/* Print Chart (SVG static) */}
      <div className={styles.printChartContainer + ' hidden print:block print:display-block'}>
        {renderPrintChart()}
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