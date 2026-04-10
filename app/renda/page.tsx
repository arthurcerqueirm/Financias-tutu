'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Trash2, RefreshCw, Edit2 } from 'lucide-react'
import PageTransition, { fadeInUp, staggerContainer } from '@/components/ui/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Modal from '@/components/ui/Modal'
import DeleteConfirm from '@/components/ui/DeleteConfirm'
import CategoryDonut from '@/components/charts/CategoryDonut'
import { useFinance } from '@/lib/context'
import { formatCurrency, formatDate, filterByCurrentMonth, getExpenseByCategory } from '@/lib/utils'
import { Income, IncomeCategory, INCOME_CATEGORIES } from '@/lib/types'

const EMPTY_FORM = {
  description: '',
  amount: '',
  category: 'salary' as IncomeCategory,
  date: new Date().toISOString().split('T')[0],
  recurring: false,
}

export default function RendaPage() {
  const { data, addIncome, deleteIncome, monthlyIncome } = useFinance()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const currentMonthIncome = useMemo(() => filterByCurrentMonth(data.income), [data.income])
  const allSorted = useMemo(
    () => [...data.income].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.income]
  )

  const incomeByCategory = useMemo(() => {
    return Object.entries(
      currentMonthIncome.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount
        return acc
      }, {} as Record<string, number>)
    ).map(([cat, value]) => ({
      name: INCOME_CATEGORIES[cat as IncomeCategory]?.label || cat,
      value,
      color: INCOME_CATEGORIES[cat as IncomeCategory]?.color || '#94A3B8',
    }))
  }, [currentMonthIncome])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.amount) return
    addIncome({
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      recurring: form.recurring,
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
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-slate-400">Gestão de Receitas</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Renda</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #059669, #10B981)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </motion.div>

        {/* Hero + Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassCard
            glow="rgba(52, 211, 153, 0.1)"
            hoverable={false}
            style={{
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(16, 185, 129, 0.08))',
              border: '1px solid rgba(52, 211, 153, 0.2)',
            }}
          >
            <p className="text-xs text-slate-400 mb-1">Renda do Mês</p>
            <AnimatedCounter value={monthlyIncome} currency className="text-3xl font-black gradient-text-green" duration={1.5} />
            <p className="text-xs text-slate-500 mt-2">
              {currentMonthIncome.length} lançamento(s) este mês
            </p>
          </GlassCard>

          <GlassCard hoverable={false}>
            <p className="text-xs text-slate-400 mb-1">Total Histórico</p>
            <AnimatedCounter
              value={data.income.reduce((s, i) => s + i.amount, 0)}
              currency
              className="text-3xl font-black text-white"
              duration={1.5}
            />
            <p className="text-xs text-slate-500 mt-2">{data.income.length} registros no total</p>
          </GlassCard>
        </motion.div>

        {/* Category chart + breakdown */}
        {incomeByCategory.length > 0 && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-2">Distribuição por Categoria</h3>
              <CategoryDonut data={incomeByCategory} centerLabel="Este mês" centerValue={monthlyIncome} />
            </GlassCard>
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-4">Categorias</h3>
              <div className="space-y-3">
                {incomeByCategory.map((cat) => {
                  const pct = monthlyIncome > 0 ? (cat.value / monthlyIncome) * 100 : 0
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300">{cat.name}</span>
                        <span className="text-sm font-semibold text-white">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: cat.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Transaction list */}
        <motion.div variants={fadeInUp}>
          <GlassCard hoverable={false}>
            <h3 className="text-sm font-semibold text-white mb-4">Todos os Lançamentos</h3>
            {allSorted.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-slate-600">
                <TrendingUp className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Nenhuma renda registrada.</p>
                <p className="text-xs mt-1">Clique em &quot;Adicionar&quot; para começar.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allSorted.map((item, i) => {
                  const cat = INCOME_CATEGORIES[item.category]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between p-3 rounded-xl group"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: `${cat.color}15` }}
                        >
                          {cat.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{item.description}</p>
                            {item.recurring && (
                              <div
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                                style={{ background: 'rgba(139, 92, 246, 0.15)' }}
                              >
                                <RefreshCw className="w-2.5 h-2.5 text-purple-400" />
                                <span className="text-[10px] text-purple-400">Recorrente</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-md"
                              style={{ background: `${cat.color}12`, color: cat.color }}
                            >
                              {cat.label}
                            </span>
                            <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold gradient-text-green">{formatCurrency(item.amount)}</p>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteId(item.id)}
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nova Receita">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Salário, Freelance..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Valor (R$)</label>
              <input
                type="number"
                placeholder="0,00"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500/50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  colorScheme: 'dark',
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(INCOME_CATEGORIES) as [IncomeCategory, (typeof INCOME_CATEGORIES)[IncomeCategory]][]).map(
                ([key, val]) => (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setForm({ ...form, category: key })}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all"
                    style={{
                      background: form.category === key ? `${val.color}20` : 'rgba(255,255,255,0.04)',
                      border: form.category === key ? `1px solid ${val.color}50` : '1px solid rgba(255,255,255,0.06)',
                      color: form.category === key ? val.color : '#64748B',
                    }}
                  >
                    <span>{val.emoji}</span>
                    <span className="font-medium">{val.label}</span>
                  </motion.button>
                )
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="relative w-10 h-5 rounded-full transition-all duration-200"
              style={{ background: form.recurring ? '#10B981' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setForm({ ...form, recurring: !form.recurring })}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: form.recurring ? '1.25rem' : '0.125rem' }}
              />
            </div>
            <span className="text-sm text-slate-300">Renda recorrente</span>
          </label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #059669, #10B981)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
            }}
          >
            Adicionar Receita
          </motion.button>
        </form>
      </Modal>

      <DeleteConfirm
        isOpen={!!deleteId}
        itemName={deleteId ? data.income.find((i) => i.id === deleteId)?.description : undefined}
        onConfirm={() => {
          if (deleteId) deleteIncome(deleteId)
          setDeleteId(null)
        }}
        onCancel={() => setDeleteId(null)}
      />
    </PageTransition>
  )
}
