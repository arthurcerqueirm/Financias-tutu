'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, CreditCard, Trash2, RefreshCw } from 'lucide-react'
import PageTransition, { fadeInUp, staggerContainer } from '@/components/ui/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Modal from '@/components/ui/Modal'
import DeleteConfirm from '@/components/ui/DeleteConfirm'
import CategoryDonut from '@/components/charts/CategoryDonut'
import { useFinance } from '@/lib/context'
import { formatCurrency, formatDate, filterByCurrentMonth } from '@/lib/utils'
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/lib/types'

const EMPTY_FORM = {
  description: '',
  amount: '',
  category: 'food' as ExpenseCategory,
  date: new Date().toISOString().split('T')[0],
  recurring: false,
}

export default function GastosPage() {
  const { data, addExpense, deleteExpense, monthlyExpenses, monthlyIncome } = useFinance()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const currentMonthExpenses = useMemo(() => filterByCurrentMonth(data.expenses), [data.expenses])
  const allSorted = useMemo(
    () => [...data.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.expenses]
  )

  const expensesByCategory = useMemo(() => {
    return Object.entries(
      currentMonthExpenses.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount
        return acc
      }, {} as Record<string, number>)
    )
      .map(([cat, value]) => ({
        name: EXPENSE_CATEGORIES[cat as ExpenseCategory]?.label || cat,
        value,
        color: EXPENSE_CATEGORIES[cat as ExpenseCategory]?.color || '#94A3B8',
        key: cat,
      }))
      .sort((a, b) => b.value - a.value)
  }, [currentMonthExpenses])

  const savingsRate = monthlyIncome > 0
    ? Math.max(0, ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
    : 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.amount) return
    addExpense({
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
              <CreditCard className="w-4 h-4 text-red-400" />
              <p className="text-sm text-slate-400">Controle de Despesas</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Gastos</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #DC2626, #EF4444)',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
            }}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <GlassCard
            glow="rgba(248, 113, 113, 0.1)"
            hoverable={false}
            style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.12), rgba(239, 68, 68, 0.06))',
              border: '1px solid rgba(248, 113, 113, 0.2)',
            }}
          >
            <p className="text-xs text-slate-400 mb-1">Gastos do Mês</p>
            <AnimatedCounter value={monthlyExpenses} currency className="text-2xl font-black gradient-text-red" duration={1.5} />
          </GlassCard>

          <GlassCard hoverable={false}>
            <p className="text-xs text-slate-400 mb-1">Total Histórico</p>
            <AnimatedCounter
              value={data.expenses.reduce((s, e) => s + e.amount, 0)}
              currency
              className="text-2xl font-black text-white"
              duration={1.5}
            />
          </GlassCard>

          <GlassCard
            hoverable={false}
            className="col-span-2 sm:col-span-1"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(79, 70, 229, 0.06))',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <p className="text-xs text-slate-400 mb-1">Taxa de Poupança</p>
            <div className="flex items-end gap-1">
              <AnimatedCounter
                value={savingsRate}
                decimals={1}
                suffix="%"
                className="text-2xl font-black gradient-text"
                duration={1.5}
              />
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${savingsRate}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8B5CF6, #60A5FA)' }}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Donut + Categories */}
        {expensesByCategory.length > 0 && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-2">Por Categoria</h3>
              <CategoryDonut
                data={expensesByCategory.map(({ name, value, color }) => ({ name, value, color }))}
                centerLabel="Gastos"
                centerValue={monthlyExpenses}
              />
            </GlassCard>
            <GlassCard hoverable={false}>
              <h3 className="text-sm font-semibold text-white mb-4">Orçamento por Categoria</h3>
              <div className="space-y-3">
                {expensesByCategory.map((cat) => {
                  const pct = monthlyExpenses > 0 ? (cat.value / monthlyExpenses) * 100 : 0
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{EXPENSE_CATEGORIES[cat.key as ExpenseCategory]?.emoji}</span>
                          <span className="text-sm text-slate-300">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-white">{formatCurrency(cat.value)}</span>
                          <span className="text-xs text-slate-500 ml-1">({pct.toFixed(0)}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
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

        {/* Expense list */}
        <motion.div variants={fadeInUp}>
          <GlassCard hoverable={false}>
            <h3 className="text-sm font-semibold text-white mb-4">Todos os Gastos</h3>
            {allSorted.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-slate-600">
                <CreditCard className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Nenhum gasto registrado.</p>
                <p className="text-xs mt-1">Clique em &quot;Adicionar&quot; para começar.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allSorted.map((item, i) => {
                  const cat = EXPENSE_CATEGORIES[item.category]
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
                        <p className="text-sm font-bold gradient-text-red">{formatCurrency(item.amount)}</p>
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Novo Gasto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Supermercado, Aluguel..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-red-500/50"
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
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-red-500/50"
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
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-red-500/50"
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
              {(Object.entries(EXPENSE_CATEGORIES) as [ExpenseCategory, (typeof EXPENSE_CATEGORIES)[ExpenseCategory]][]).map(
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
                    <span className="font-medium leading-tight text-center">{val.label}</span>
                  </motion.button>
                )
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="relative w-10 h-5 rounded-full transition-all duration-200"
              style={{ background: form.recurring ? '#EF4444' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setForm({ ...form, recurring: !form.recurring })}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: form.recurring ? '1.25rem' : '0.125rem' }}
              />
            </div>
            <span className="text-sm text-slate-300">Gasto recorrente</span>
          </label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #DC2626, #EF4444)',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
            }}
          >
            Registrar Gasto
          </motion.button>
        </form>
      </Modal>

      <DeleteConfirm
        isOpen={!!deleteId}
        itemName={deleteId ? data.expenses.find((e) => e.id === deleteId)?.description : undefined}
        onConfirm={() => {
          if (deleteId) deleteExpense(deleteId)
          setDeleteId(null)
        }}
        onCancel={() => setDeleteId(null)}
      />
    </PageTransition>
  )
}
