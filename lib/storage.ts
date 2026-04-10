import { FinanceData } from './types'
import { generateId } from './utils'

const STORAGE_KEY = 'financias_tutu_data'

function getDefaultData(): FinanceData {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const m = (offset: number) => {
    const d = new Date(today)
    d.setMonth(d.getMonth() + offset)
    return d
  }

  return {
    income: [
      { id: generateId(), description: 'Salário', amount: 8500, category: 'salary', date: fmt(m(0)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 8500, category: 'salary', date: fmt(m(-1)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 8500, category: 'salary', date: fmt(m(-2)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 8000, category: 'salary', date: fmt(m(-3)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 8000, category: 'salary', date: fmt(m(-4)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 8000, category: 'salary', date: fmt(m(-5)), recurring: true },
      { id: generateId(), description: 'Freelance - Projeto Web', amount: 2200, category: 'freelance', date: fmt(m(-1)), recurring: false },
      { id: generateId(), description: 'Dividendos ITSA4', amount: 320, category: 'dividend', date: fmt(m(0)), recurring: false },
      { id: generateId(), description: 'Aluguel Imóvel', amount: 1400, category: 'rent', date: fmt(m(0)), recurring: true },
      { id: generateId(), description: 'Aluguel Imóvel', amount: 1400, category: 'rent', date: fmt(m(-1)), recurring: true },
    ],
    expenses: [
      { id: generateId(), description: 'Aluguel Apartamento', amount: 2600, category: 'housing', date: fmt(m(0)), recurring: true },
      { id: generateId(), description: 'Supermercado', amount: 720, category: 'food', date: fmt(m(0)), recurring: false },
      { id: generateId(), description: 'iFood e Restaurantes', amount: 380, category: 'food', date: fmt(m(0)), recurring: false },
      { id: generateId(), description: 'Combustível', amount: 280, category: 'transport', date: fmt(m(0)), recurring: false },
      { id: generateId(), description: 'Plano de Saúde', amount: 420, category: 'health', date: fmt(m(0)), recurring: true },
      { id: generateId(), description: 'Spotify + Netflix + YouTube', amount: 89, category: 'subscriptions', date: fmt(m(0)), recurring: true },
      { id: generateId(), description: 'Academia', amount: 120, category: 'health', date: fmt(m(0)), recurring: true },
      { id: generateId(), description: 'Curso Online', amount: 197, category: 'education', date: fmt(m(0)), recurring: false },
      { id: generateId(), description: 'Roupas e Acessórios', amount: 340, category: 'shopping', date: fmt(m(0)), recurring: false },
      { id: generateId(), description: 'Aluguel Apartamento', amount: 2600, category: 'housing', date: fmt(m(-1)), recurring: true },
      { id: generateId(), description: 'Supermercado', amount: 690, category: 'food', date: fmt(m(-1)), recurring: false },
      { id: generateId(), description: 'Plano de Saúde', amount: 420, category: 'health', date: fmt(m(-1)), recurring: true },
      { id: generateId(), description: 'Cinema + Saídas', amount: 260, category: 'entertainment', date: fmt(m(-1)), recurring: false },
      { id: generateId(), description: 'Aluguel Apartamento', amount: 2600, category: 'housing', date: fmt(m(-2)), recurring: true },
      { id: generateId(), description: 'Supermercado', amount: 710, category: 'food', date: fmt(m(-2)), recurring: false },
      { id: generateId(), description: 'Manutenção Carro', amount: 850, category: 'transport', date: fmt(m(-2)), recurring: false },
      { id: generateId(), description: 'Plano de Saúde', amount: 420, category: 'health', date: fmt(m(-2)), recurring: true },
    ],
    investments: [
      { id: generateId(), name: 'CDB Banco Inter 120% CDI', type: 'fixed_income', invested: 15000, currentValue: 16240, date: fmt(new Date(today.getFullYear() - 1, today.getMonth(), 1)) },
      { id: generateId(), name: 'Tesouro IPCA+ 2029', type: 'fixed_income', invested: 8000, currentValue: 8720, date: fmt(new Date(today.getFullYear() - 1, today.getMonth() + 3, 1)) },
      { id: generateId(), name: 'PETR4 - Petrobras', type: 'stocks', invested: 4000, currentValue: 4680, date: fmt(m(-6)) },
      { id: generateId(), name: 'VALE3 - Vale', type: 'stocks', invested: 3000, currentValue: 2850, date: fmt(m(-5)) },
      { id: generateId(), name: 'HGLG11 - FII Logístico', type: 'real_estate', invested: 5000, currentValue: 5420, date: fmt(m(-8)) },
      { id: generateId(), name: 'Bitcoin (BTC)', type: 'crypto', invested: 3000, currentValue: 4200, date: fmt(m(-10)) },
      { id: generateId(), name: 'IBOV11 - ETF Ibovespa', type: 'funds', invested: 6000, currentValue: 6380, date: fmt(m(-7)) },
    ],
  }
}

export function loadData(): FinanceData {
  if (typeof window === 'undefined') return getDefaultData()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const defaultData = getDefaultData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
      return defaultData
    }
    return JSON.parse(raw) as FinanceData
  } catch {
    return getDefaultData()
  }
}

export function saveData(data: FinanceData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
