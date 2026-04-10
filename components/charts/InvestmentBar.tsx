'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatCurrencyCompact, formatCurrency } from '@/lib/utils'
import { INVESTMENT_TYPES } from '@/lib/types'

interface InvestmentBarProps {
  data: Array<{ type: string; invested: number; currentValue: number }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const invested = payload.find((p: any) => p.dataKey === 'invested')?.value || 0
  const current = payload.find((p: any) => p.dataKey === 'currentValue')?.value || 0
  const diff = current - invested
  const pct = invested > 0 ? ((diff / invested) * 100).toFixed(1) : '0'

  return (
    <div
      className="rounded-xl p-3 text-sm"
      style={{
        background: 'rgba(15, 22, 41, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p className="text-white font-semibold mb-2">{label}</p>
      <p className="text-slate-400">Investido: <span className="text-blue-400">{formatCurrency(invested)}</span></p>
      <p className="text-slate-400">Atual: <span className="text-purple-400">{formatCurrency(current)}</span></p>
      <p className="text-slate-400">
        Retorno:{' '}
        <span style={{ color: diff >= 0 ? '#34D399' : '#F87171' }}>
          {diff >= 0 ? '+' : ''}{formatCurrency(diff)} ({pct}%)
        </span>
      </p>
    </div>
  )
}

export default function InvestmentBar({ data }: InvestmentBarProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="type"
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatCurrencyCompact}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="invested"
          name="Investido"
          fill="#60A5FA"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
          opacity={0.7}
          animationDuration={1000}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="currentValue"
          name="Atual"
          fill="#8B5CF6"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
          animationDuration={1000}
          animationEasing="ease-out"
          animationBegin={200}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
