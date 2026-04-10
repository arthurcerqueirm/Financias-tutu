'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrencyCompact } from '@/lib/utils'

interface OverviewChartProps {
  data: Array<{ month: string; renda: number; gastos: number; saldo: number }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
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
      <p className="text-slate-400 mb-2 font-medium capitalize">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-400 capitalize">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {formatCurrencyCompact(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function OverviewChart({ data }: OverviewChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="rendaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gastosGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          style={{ textTransform: 'capitalize' }}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatCurrencyCompact}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '12px' }}
          formatter={(value) => (
            <span style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'capitalize' }}>
              {value}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="renda"
          name="Renda"
          stroke="#34D399"
          strokeWidth={2}
          fill="url(#rendaGrad)"
          dot={{ r: 3, fill: '#34D399', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#34D399', strokeWidth: 0 }}
          animationDuration={1200}
          animationEasing="ease-out"
        />
        <Area
          type="monotone"
          dataKey="gastos"
          name="Gastos"
          stroke="#F87171"
          strokeWidth={2}
          fill="url(#gastosGrad)"
          dot={{ r: 3, fill: '#F87171', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#F87171', strokeWidth: 0 }}
          animationDuration={1200}
          animationEasing="ease-out"
          animationBegin={200}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
