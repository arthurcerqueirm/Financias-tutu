'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react'
import PageTransition, { fadeInUp, staggerContainer } from '@/components/ui/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import OverviewChart from '@/components/charts/OverviewChart'
import CategoryDonut from '@/components/charts/CategoryDonut'
import { useFinance } from '@/lib/context'
import { formatCurrency, formatDate, getMonthlyData, getExpenseByCategory, filterByCurrentMonth } from '@/lib/utils'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/types'

export default function Dashboard() {
  const {
    data,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    totalInvestmentValue,
    netWorth,
    investmentReturn,
    totalInvested,
  } = useFinance()

  const chartData = useMemo(() => getMonthlyData(data.income, data.expenses, 6), [data])
  const expenseByCategory = useMemo(
    () => getExpenseByCategory(filterByCurrentMonth(data.expenses)),
    [data.expenses]
  )

  const recentTransactions = useMemo(() => {
    const incomeItems = data.income.map((i) => ({ ...i, _type: 'income' as const }))
    const expenseItems = data.expenses.map((e) => ({ ...e, _type: 'expense' as const }))
    return [...incomeItems, ...expenseItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
  }, [data])

  const investReturnPct = totalInvested > 0 ? ((investmentReturn / totalInvested) * 100) : 0

  const stats = [
    {
      label: 'Renda do Mês',
      value: monthlyIncome,
      icon: TrendingUp,
      color: '#34D399',
      bg: 'rgba(52, 211, 153, 0.1)',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Gastos do Mês',
      value: monthlyExpenses,
      icon: TrendingDown,
      color: '#F87171',
      bg: 'rgba(248, 113, 113, 0.1)',
      trend: '-3%',
      trendUp: false,
    },
    {
      label: 'Investimentos',
      value: totalInvestmentValue,
      icon: BarChart3,
      color: '#60A5FA',
      bg: 'rgba(96, 165, 250, 0.1)',
      trend: `+${investReturnPct.toFixed(1)}%`,
      trendUp: investmentReturn >= 0,
    },
  ]

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm text-slate-400">Visão Geral</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Saldo do mês</p>
            <p
              className="text-lg font-bold"
              style={{ color: monthlyBalance >= 0 ? '#34D399' : '#F87171' }}
            >
              {monthlyBalance >= 0 ? '+' : ''}
              <AnimatedCounter value={monthlyBalance} currency className="font-bold" />
            </p>
          </div>
        </motion.div>

        {/* Hero Patrimônio Card */}
        <motion.div variants={fadeInUp}>
          <GlassCard
            glow="rgba(139, 92, 246, 0.15)"
            className="relative overflow-hidden"
            hoverable={false}
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(79, 70, 229, 0.1), rgba(96, 165, 250, 0.08))',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            {/* Animated BG circles */}
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 animate-float"
              style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(139, 92, 246, 0.2)' }}
                >
                  <Wallet className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-sm text-slate-400">Patrimônio Total</p>
              </div>
              <div className="flex items-end gap-3 mb-1">
                <AnimatedCounter
                  value={totalInvestmentValue}
                  currency
                  className="text-4xl font-black gradient-text"
                  duration={1.8}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
                  style={{
                    background: investmentReturn >= 0 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                    color: investmentReturn >= 0 ? '#34D399' : '#F87171',
                  }}
                >
                  {investmentReturn >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {investmentReturn >= 0 ? '+' : ''}{formatCurrency(investmentReturn)} ({investReturnPct.toFixed(1)}%)
                </div>
                <span className="text-xs text-slate-500">vs. valor investido</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            >
              <GlassCard className="relative overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: stat.bg, boxShadow: `0 0 16px ${stat.color}20` }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg"
                    style={{
                      background: stat.trendUp ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      color: stat.trendUp ? '#34D399' : '#F87171',
                    }}
                  >
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                <AnimatedCounter
                  value={stat.value}
                  currency
                  className="text-xl font-bold text-white"
                  duration={1.5}
                />

                {/* Bottom glow line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts row */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Overview Chart */}
          <GlassCard className="lg:col-span-2" hoverable={false}>
            <h3 className="text-sm font-semibold text-white mb-4">Histórico 6 Meses</h3>
            <OverviewChart data={chartData} />
          </GlassCard>

          {/* Donut */}
          <GlassCard hoverable={false}>
            <h3 className="text-sm font-semibold text-white mb-2">Gastos por Categoria</h3>
            {expenseByCategory.length > 0 ? (
              <>
                <CategoryDonut data={expenseByCategory} centerLabel="Gastos" centerValue={monthlyExpenses} />
                <div className="space-y-1.5 mt-2">
                  {expenseByCategory.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-xs text-slate-400 truncate max-w-[90px]">{item.name}</span>
                      </div>
                      <span className="text-xs font-medium text-white">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                <TrendingDown className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Sem gastos este mês</p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={fadeInUp}>
          <GlassCard hoverable={false}>
            <h3 className="text-sm font-semibold text-white mb-4">Movimentações Recentes</h3>
            {recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {recentTransactions.map((tx, i) => {
                  const isIncome = tx._type === 'income'
                  const cat = isIncome
                    ? INCOME_CATEGORIES[tx.category as keyof typeof INCOME_CATEGORIES]
                    : EXPENSE_CATEGORIES[(tx as any).category as keyof typeof EXPENSE_CATEGORIES]
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                          style={{ background: cat ? `${cat.color}15` : 'rgba(255,255,255,0.05)' }}
                        >
                          {cat?.emoji || '💰'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">{tx.description}</p>
                          <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: isIncome ? '#34D399' : '#F87171' }}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Nenhuma movimentação registrada.</p>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
