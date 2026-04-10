'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, BarChart3, Trash2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import PageTransition, { fadeInUp, staggerContainer } from '@/components/ui/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Modal from '@/components/ui/Modal'
import DeleteConfirm from '@/components/ui/DeleteConfirm'
import CategoryDonut from '@/components/charts/CategoryDonut'
import InvestmentBar from '@/components/charts/InvestmentBar'
import { useFinance } from '@/lib/context'
import { formatCurrency, formatDate, getInvestmentReturn, getInvestmentReturnPercent, getTotalInvestmentReturnPercent } from '@/lib/utils'
import { InvestmentType, INVESTMENT_TYPES } from '@/lib/types'

const EMPTY_FORM = {
  name: '',
  invested: '',
  currentValue: '',
  type: 'fixed_income' as InvestmentType,
  date: new Date().toISOString().split('T')[0],
  notes: '',
}

export default function InvestimentosPage() {
  const { data, addInvestment, deleteInvestment, totalInvested, totalInvestmentValue, investmentReturn } = useFinance()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const returnPct = getTotalInvestmentReturnPercent(data.investments)

  const byType = useMemo(() => {
    const grouped = data.investments.reduce(
      (acc, inv) => {
        if (!acc[inv.type]) acc[inv.type] = { invested: 0, currentValue: 0 }
        acc[inv.type].invested += inv.invested
        acc[inv.type].currentValue += inv.currentValue
        return acc
      },
      {} as Record<string, { invested: number; currentValue: number }>
    )
    return Object.entries(grouped).map(([type, vals]) => ({
      type: INVESTMENT_TYPES[type as InvestmentType]?.label || type,
      ...vals,
    }))
  }, [data.investments])

  const donutData = useMemo(() => {
    return byType.map((item) => {
      const typeKey = Object.entries(INVESTMENT_TYPES).find(([, v]) => v.label === item.type)?.[0]
      return {
        name: item.type,
        value: item.currentValue,
        color: INVESTMENT_TYPES[typeKey as InvestmentType]?.color || '#94A3B8',
      }
    })
  }, [byType])

  const sorted = useMemo(
    () => [...data.investments].sort((a, b) => b.currentValue - a.currentValue),
    [data.investments]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.invested || !form.currentValue) return
    addInvestment({
      name: form.name,
      type: form.type,
      invested: parseFloat(form.invested),
      currentValue: parseFloat(form.currentValue),
      date: form.date,
      notes: form.notes || undefined,
    })
    setForm(EMPTY_FORM)
    setIsOpen(false)
  }

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-slate-400">Carteira de Investimentos</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Investimentos</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
            }}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </motion.div>

        {/* Hero cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard
            glow="rgba(96, 165, 250, 0.1)"
            hoverable={false}
            style={{
              background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.15), rgba(59, 130, 246, 0.08))',
              border: '1px solid rgba(96, 165, 250, 0.2)',
            }}
          >
            <p className="text-xs text-slate-400 mb-1">Valor Atual</p>
            <AnimatedCounter
              value={totalInvestmentValue}
              currency
              className="text-2xl font-black text-blue-300"
              duration={1.5}
            />
          </GlassCard>

          <GlassCard hoverable={false}>
            <p className="text-xs text-slate-400 mb-1">Total Investido</p>
            <AnimatedCounter
              value={totalInvested}
              currency
              className="text-2xl font-black text-white"
              duration={1.5}
            />
          </GlassCard>

          <GlassCard
            hoverable={false}
            style={{
              background:
                investmentReturn >= 0
                  ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(16, 185, 129, 0.08))'
                  : 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(239, 68, 68, 0.08))',
              border: `1px solid ${investmentReturn >= 0 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`,
            }}
          >
            <p className="text-xs text-slate-400 mb-1">Rendimento Total</p>
            <div className="flex items-center gap-2">
              {investmentReturn >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <AnimatedCounter
                value={investmentReturn}
                currency
                className={`text-2xl font-black ${investmentReturn >= 0 ? 'gradient-text-green' : 'gradient-text-red'}`}
                duration={1.5}
              />
            </div>
            <div
              className="flex items-center gap-1 mt-1 text-xs font-medium"
              style={{ color: investmentReturn >= 0 ? '#34D399' : '#F87171' }}
            >
              {investmentReturn >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}% de retorno
            </div>
          </GlassCard>
        </motion.div>

        {/* Charts */}
        {data.investments.length > 0 && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-2">Distribuição da Carteira</h3>
              <CategoryDonut data={donutData} centerLabel="Total" centerValue={totalInvestmentValue} />
              <div className="grid grid-cols-2 gap-2 mt-3">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-slate-400 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-4">Investido vs. Atual</h3>
              <InvestmentBar data={byType.map((b) => ({
                ...b,
                type: b.type.split(' ')[0],
              }))} />
            </GlassCard>
          </motion.div>
        )}

        {/* Investment list */}
        <motion.div variants={fadeInUp}>
          <GlassCard hoverable={false}>
            <h3 className="text-sm font-semibold text-white mb-4">Ativos</h3>
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-slate-600">
                <BarChart3 className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Nenhum investimento registrado.</p>
                <p className="text-xs mt-1">Clique em &quot;Adicionar&quot; para começar.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sorted.map((inv, i) => {
                  const ret = getInvestmentReturn(inv)
                  const retPct = getInvestmentReturnPercent(inv)
                  const type = INVESTMENT_TYPES[inv.type]
                  return (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl group"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: `${type.color}15` }}
                        >
                          {type.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{inv.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0"
                              style={{ background: `${type.color}12`, color: type.color }}
                            >
                              {type.label}
                            </span>
                            <span className="text-xs text-slate-500">{formatDate(inv.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{formatCurrency(inv.currentValue)}</p>
                          <div
                            className="flex items-center justify-end gap-0.5 text-xs font-medium"
                            style={{ color: ret >= 0 ? '#34D399' : '#F87171' }}
                          >
                            {ret >= 0 ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {ret >= 0 ? '+' : ''}{retPct.toFixed(1)}%
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteId(inv.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(248, 113, 113, 0.1)' }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Add Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Novo Investimento">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Nome do Ativo</label>
            <input
              type="text"
              placeholder="Ex: CDB Banco Inter, PETR4..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Valor Investido (R$)</label>
              <input
                type="number"
                placeholder="0,00"
                step="0.01"
                min="0"
                value={form.invested}
                onChange={(e) => setForm({ ...form, invested: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Valor Atual (R$)</label>
              <input
                type="number"
                placeholder="0,00"
                step="0.01"
                min="0"
                value={form.currentValue}
                onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Data de Compra</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                colorScheme: 'dark',
              }}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(INVESTMENT_TYPES) as [InvestmentType, (typeof INVESTMENT_TYPES)[InvestmentType]][]).map(
                ([key, val]) => (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setForm({ ...form, type: key })}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all"
                    style={{
                      background: form.type === key ? `${val.color}20` : 'rgba(255,255,255,0.04)',
                      border: form.type === key ? `1px solid ${val.color}50` : '1px solid rgba(255,255,255,0.06)',
                      color: form.type === key ? val.color : '#64748B',
                    }}
                  >
                    <span>{val.emoji}</span>
                    <span className="font-medium text-center leading-tight">{val.label}</span>
                  </motion.button>
                )
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            Adicionar Investimento
          </motion.button>
        </form>
      </Modal>

      <DeleteConfirm
        isOpen={!!deleteId}
        itemName={deleteId ? data.investments.find((i) => i.id === deleteId)?.name : undefined}
        onConfirm={() => {
          if (deleteId) deleteInvestment(deleteId)
          setDeleteId(null)
        }}
        onCancel={() => setDeleteId(null)}
      />
    </PageTransition>
  )
}
