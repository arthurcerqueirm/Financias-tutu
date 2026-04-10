import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Income, Expense, Investment } from './types'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}k`
  }
  return formatCurrency(value)
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatMonthYear(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM/yy', { locale: ptBR })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getMonthRange(date: Date = new Date()) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function filterByCurrentMonth<T extends { date: string }>(items: T[]): T[] {
  const { start, end } = getMonthRange()
  return items.filter((item) => {
    const itemDate = parseISO(item.date)
    return isWithinInterval(itemDate, { start, end })
  })
}

export function filterByMonth<T extends { date: string }>(items: T[], date: Date): T[] {
  const { start, end } = getMonthRange(date)
  return items.filter((item) => {
    const itemDate = parseISO(item.date)
    return isWithinInterval(itemDate, { start, end })
  })
}

export function getMonthlyData(
  income: Income[],
  expenses: Expense[],
  months = 6
): Array<{ month: string; renda: number; gastos: number; saldo: number }> {
  const result = []
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const monthIncome = filterByMonth(income, date).reduce((sum, item) => sum + item.amount, 0)
    const monthExpenses = filterByMonth(expenses, date).reduce((sum, item) => sum + item.amount, 0)
    result.push({
      month: format(date, 'MMM', { locale: ptBR }),
      renda: monthIncome,
      gastos: monthExpenses,
      saldo: monthIncome - monthExpenses,
    })
  }
  return result
}

export function getExpenseByCategory(expenses: Expense[]): Array<{ name: string; value: number; color: string }> {
  const { EXPENSE_CATEGORIES } = require('./types')
  const grouped = expenses.reduce(
    (acc, expense) => {
      const key = expense.category
      acc[key] = (acc[key] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(grouped)
    .map(([category, value]) => ({
      name: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.label || category,
      value,
      color: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.color || '#94A3B8',
    }))
    .sort((a, b) => b.value - a.value)
}

export function getInvestmentReturn(investment: Investment): number {
  return investment.currentValue - investment.invested
}

export function getInvestmentReturnPercent(investment: Investment): number {
  if (investment.invested === 0) return 0
  return ((investment.currentValue - investment.invested) / investment.invested) * 100
}

export function getTotalInvestmentReturn(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + getInvestmentReturn(inv), 0)
}

export function getTotalInvestmentReturnPercent(investments: Investment[]): number {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0)
  if (totalInvested === 0) return 0
  const totalReturn = getTotalInvestmentReturn(investments)
  return (totalReturn / totalInvested) * 100
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
