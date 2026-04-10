'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrencyCompact, formatCurrency } from '@/lib/utils'

interface CategoryDonutProps {
  data: Array<{ name: string; value: number; color: string }>
  centerLabel?: string
  centerValue?: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div
      className="rounded-xl p-3 text-sm"
      style={{
        background: 'rgba(15, 22, 41, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.payload.color }} />
        <span className="text-white font-medium">{item.name}</span>
      </div>
      <p className="text-slate-400">{formatCurrency(item.value)}</p>
      <p className="text-xs text-slate-500">{item.payload.percent?.toFixed(1)}%</p>
    </div>
  )
}

export default function CategoryDonut({ data, centerLabel = 'Total', centerValue }: CategoryDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: total > 0 ? (item.value / total) * 100 : 0,
  }))

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {dataWithPercent.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
                style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-xs text-slate-500 mb-0.5">{centerLabel}</p>
        <p className="text-base font-bold text-white">
          {centerValue !== undefined
            ? formatCurrencyCompact(centerValue)
            : formatCurrencyCompact(total)}
        </p>
      </div>
    </div>
  )
}
