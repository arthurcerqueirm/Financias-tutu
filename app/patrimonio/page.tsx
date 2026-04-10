'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Wallet,
  BarChart3,
  DollarSign,
} from 'lucide-react'
import PageTransition, { fadeInUp, staggerContainer } from '@/components/ui/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import CategoryDonut from '@/components/charts/CategoryDonut'
import { useFinance } from '@/lib/context'
import { formatCurrency, filterByCurrentMonth, getTotalInvestmentReturnPercent, getInvestmentReturn, getInvestmentReturnPercent } from '@/lib/utils'
import { INVESTMENT_TYPES, InvestmentType } from '@/lib/types'

export default function PatrimonioPage() {
  const {
    data,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    totalInvested,
    totalInvestmentValue,
    investmentReturn,
  } = useFinance()

  const returnPct = getTotalInvestmentReturnPercent(data.investments)

  // Wealth composition for donut
  const wealthBreakdown = useMemo(() => {
    const investByType = data.investments.reduce(
      (acc, inv) => {
        acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue
        return acc
      },
      {} as Record<string, number>
    )

    const result = Object.entries(investByType).map(([type, value]) => ({
      name: INVESTMENT_TYPES[type as InvestmentType]?.label || type,
      value,
      color: INVESTMENT_TYPES[type as InvestmentType]?.color || '#94A3B8',
    }))

    // Add monthly balance as "Caixa" if positive
    if (monthlyBalance > 0) {
      result.push({ name: 'Caixa do Mês', value: monthlyBalance, color: '#34D399' })
    }

    return result
  }, [data.investments, monthlyBalance])

  // Best and worst investments
  const ranked = useMemo(
    () =>
      [...data.investments]
        .map((inv) => ({ ...inv, ret: getInvestmentReturn(inv), retPct: getInvestmentReturnPercent(inv) }))
        .sort((a, b) => b.retPct - a.retPct),
    [data.investments]
  )

  const best = ranked[0]
  const worst = ranked[ranked.length - 1]

  const totalNetWorth = totalInvestmentValue + Math.max(0, monthlyBalance)

  const pillars = [
    {
      label: 'Carteira Total',
      value: totalInvestmentValue,
      icon: BarChart3,
      color: '#60A5FA',
      sub: `${data.investments.length} ativo(s)`,
    },
    {
      label: 'Total Investido',
      value: totalInvested,
      icon: PiggyBank,
      color: '#8B5CF6',
      sub: 'Capital aportado',
    },
    {
      label: 'Rendimento',
      value: investmentReturn,
      icon: investmentReturn >= 0 ? TrendingUp : TrendingDown,
      color: investmentReturn >= 0 ? '#34D399' : '#F87171',
      sub: `${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(2)}% de retorno`,
    },
    {
      label: 'Saldo do Mês',
      value: monthlyBalance,
      icon: monthlyBalance >= 0 ? Wallet : DollarSign,
      color: monthlyBalance >= 0 ? '#34D399' : '#F87171',
      sub: `Renda: ${formatCurrency(monthlyIncome)} | Gastos: ${formatCurrency(monthlyExpenses)}`,
    },
  ]

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="w-4 h-4 text-amber-400" />
              <p className="text-sm text-slate-400">Visão Patrimonial</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Patrimônio</h1>
          </div>
        </motion.div>

        {/* Net Worth Hero */}
        <motion.div variants={fadeInUp}>
          <GlassCard
            glow="rgba(251, 191, 36, 0.1)"
            hoverable={false}
            style={{
              background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.15), rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.05))',
              border: '1px solid rgba(251, 191, 36, 0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Patrimônio Líquido Estimado</p>
                <AnimatedCounter
                  value={totalNetWorth}
                  currency
                  className="text-4xl font-black"
                  duration={2}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Investimentos + saldo disponível do mês
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4"
                style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
                }}
              >
                <Landmark className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            {/* Progress vs invested */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Crescimento sobre capital investido</span>
                <span style={{ color: investmentReturn >= 0 ? '#34D399' : '#F87171' }}>
                  {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(returnPct))}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: returnPct >= 0
                      ? 'linear-gradient(90deg, #34D399, #10B981)'
                      : 'linear-gradient(90deg, #F87171, #EF4444)',
                  }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 4 Pillars */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <GlassCard>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${p.color}15`, boxShadow: `0 0 12px ${p.color}20` }}
                >
                  <p.icon className="w-4 h-4" style={{ color: p.color }} />
                </div>
                <p className="text-xs text-slate-500 mb-0.5">{p.label}</p>
                <AnimatedCounter
                  value={p.value}
                  currency
                  className="text-lg font-bold text-white"
                  duration={1.5}
                />
                <p className="text-xs text-slate-500 mt-1 truncate">{p.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Composition chart */}
        {wealthBreakdown.length > 0 && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-2">Composição Patrimonial</h3>
              <CategoryDonut
                data={wealthBreakdown}
                centerLabel="Patrimônio"
                centerValue={totalNetWorth}
              />
            </GlassCard>

            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-4">Detalhamento</h3>
              <div className="space-y-3">
                {wealthBreakdown
                  .sort((a, b) => b.value - a.value)
                  .map((item) => {
                    const pct = totalNetWorth > 0 ? (item.value / totalNetWorth) * 100 : 0
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            <span className="text-sm text-slate-300">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-white">{formatCurrency(item.value)}</span>
                            <span className="text-xs text-slate-500 ml-1">({pct.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Best / Worst */}
        {data.investments.length >= 2 && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {best && (
              <GlassCard
                style={{
                  background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(16, 185, 129, 0.05))',
                  border: '1px solid rgba(52, 211, 153, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs text-slate-400">Melhor Ativo</p>
                </div>
                <p className="text-sm font-semibold text-white truncate mb-1">{best.name}</p>
                <p className="text-xs text-emerald-400 font-semibold">
                  +{best.retPct.toFixed(2)}% • {formatCurrency(best.ret)}
                </p>
              </GlassCard>
            )}
            {worst && worst.id !== best?.id && (
              <GlassCard
                style={{
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.12), rgba(239, 68, 68, 0.05))',
                  border: '1px solid rgba(248, 113, 113, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                  <p className="text-xs text-slate-400">Pior Ativo</p>
                </div>
                <p className="text-sm font-semibold text-white truncate mb-1">{worst.name}</p>
                <p className="text-xs text-red-400 font-semibold">
                  {worst.retPct.toFixed(2)}% • {formatCurrency(worst.ret)}
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* No data state */}
        {data.investments.length === 0 && (
          <motion.div variants={fadeInUp}>
            <GlassCard hoverable={false} className="flex flex-col items-center py-14">
              <Landmark className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium mb-1">Patrimônio ainda não registrado</p>
              <p className="text-sm text-slate-600">Adicione investimentos para ver seu patrimônio aqui.</p>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  )
}
