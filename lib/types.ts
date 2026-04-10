export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'business'
  | 'dividend'
  | 'rent'
  | 'other'

export type ExpenseCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'health'
  | 'education'
  | 'entertainment'
  | 'shopping'
  | 'subscriptions'
  | 'other'

export type InvestmentType =
  | 'stocks'
  | 'crypto'
  | 'fixed_income'
  | 'funds'
  | 'real_estate'
  | 'other'

export interface Income {
  id: string
  description: string
  amount: number
  category: IncomeCategory
  date: string
  recurring: boolean
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  date: string
  recurring: boolean
}

export interface Investment {
  id: string
  name: string
  type: InvestmentType
  invested: number
  currentValue: number
  date: string
  notes?: string
}

export interface FinanceData {
  income: Income[]
  expenses: Expense[]
  investments: Investment[]
}

export const INCOME_CATEGORIES: Record<IncomeCategory, { label: string; color: string; emoji: string }> = {
  salary: { label: 'Salário', color: '#34D399', emoji: '💼' },
  freelance: { label: 'Freelance', color: '#60A5FA', emoji: '💻' },
  business: { label: 'Negócio', color: '#FBBF24', emoji: '🏢' },
  dividend: { label: 'Dividendos', color: '#A78BFA', emoji: '📊' },
  rent: { label: 'Aluguel', color: '#F472B6', emoji: '🏠' },
  other: { label: 'Outros', color: '#94A3B8', emoji: '💰' },
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; color: string; emoji: string }> = {
  housing: { label: 'Moradia', color: '#F87171', emoji: '🏠' },
  food: { label: 'Alimentação', color: '#FBBF24', emoji: '🍽️' },
  transport: { label: 'Transporte', color: '#60A5FA', emoji: '🚗' },
  health: { label: 'Saúde', color: '#34D399', emoji: '❤️' },
  education: { label: 'Educação', color: '#A78BFA', emoji: '📚' },
  entertainment: { label: 'Lazer', color: '#F472B6', emoji: '🎮' },
  shopping: { label: 'Compras', color: '#FB923C', emoji: '🛍️' },
  subscriptions: { label: 'Assinaturas', color: '#22D3EE', emoji: '📱' },
  other: { label: 'Outros', color: '#94A3B8', emoji: '💳' },
}

export const INVESTMENT_TYPES: Record<InvestmentType, { label: string; color: string; emoji: string }> = {
  stocks: { label: 'Ações', color: '#60A5FA', emoji: '📈' },
  crypto: { label: 'Cripto', color: '#FBBF24', emoji: '₿' },
  fixed_income: { label: 'Renda Fixa', color: '#34D399', emoji: '🏦' },
  funds: { label: 'Fundos', color: '#A78BFA', emoji: '📊' },
  real_estate: { label: 'FIIs', color: '#F472B6', emoji: '🏢' },
  other: { label: 'Outros', color: '#94A3B8', emoji: '💼' },
}
