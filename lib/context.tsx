'use client'

import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react'
import { FinanceData, Income, Expense, Investment } from './types'
import { loadData, saveData } from './storage'
import { generateId } from './utils'
import { filterByCurrentMonth } from './utils'

type Action =
  | { type: 'ADD_INCOME'; payload: Omit<Income, 'id'> }
  | { type: 'UPDATE_INCOME'; payload: { id: string; data: Partial<Income> } }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; data: Partial<Expense> } }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_INVESTMENT'; payload: Omit<Investment, 'id'> }
  | { type: 'UPDATE_INVESTMENT'; payload: { id: string; data: Partial<Investment> } }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'LOAD_DATA'; payload: FinanceData }

function reducer(state: FinanceData, action: Action): FinanceData {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload
    case 'ADD_INCOME':
      return { ...state, income: [...state.income, { ...action.payload, id: generateId() }] }
    case 'UPDATE_INCOME':
      return {
        ...state,
        income: state.income.map((i) => (i.id === action.payload.id ? { ...i, ...action.payload.data } : i)),
      }
    case 'DELETE_INCOME':
      return { ...state, income: state.income.filter((i) => i.id !== action.payload) }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, { ...action.payload, id: generateId() }] }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((e) => (e.id === action.payload.id ? { ...e, ...action.payload.data } : e)),
      }
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) }
    case 'ADD_INVESTMENT':
      return { ...state, investments: [...state.investments, { ...action.payload, id: generateId() }] }
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map((inv) =>
          inv.id === action.payload.id ? { ...inv, ...action.payload.data } : inv
        ),
      }
    case 'DELETE_INVESTMENT':
      return { ...state, investments: state.investments.filter((inv) => inv.id !== action.payload) }
    default:
      return state
  }
}

interface FinanceContextValue {
  data: FinanceData
  addIncome: (income: Omit<Income, 'id'>) => void
  updateIncome: (id: string, data: Partial<Income>) => void
  deleteIncome: (id: string) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, data: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  addInvestment: (investment: Omit<Investment, 'id'>) => void
  updateInvestment: (id: string, data: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
  // Computed
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  totalInvested: number
  totalInvestmentValue: number
  investmentReturn: number
  netWorth: number
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

const EMPTY_DATA: FinanceData = { income: [], expenses: [], investments: [] }

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, EMPTY_DATA)

  useEffect(() => {
    dispatch({ type: 'LOAD_DATA', payload: loadData() })
  }, [])

  useEffect(() => {
    if (data !== EMPTY_DATA) {
      saveData(data)
    }
  }, [data])

  const computed = useMemo(() => {
    const currentIncome = filterByCurrentMonth(data.income)
    const currentExpenses = filterByCurrentMonth(data.expenses)
    const monthlyIncome = currentIncome.reduce((sum, i) => sum + i.amount, 0)
    const monthlyExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0)
    const totalInvested = data.investments.reduce((sum, inv) => sum + inv.invested, 0)
    const totalInvestmentValue = data.investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const investmentReturn = totalInvestmentValue - totalInvested
    const netWorth = totalInvestmentValue + monthlyIncome - monthlyExpenses

    return {
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance: monthlyIncome - monthlyExpenses,
      totalInvested,
      totalInvestmentValue,
      investmentReturn,
      netWorth,
    }
  }, [data])

  const value: FinanceContextValue = {
    data,
    addIncome: (p) => dispatch({ type: 'ADD_INCOME', payload: p }),
    updateIncome: (id, d) => dispatch({ type: 'UPDATE_INCOME', payload: { id, data: d } }),
    deleteIncome: (id) => dispatch({ type: 'DELETE_INCOME', payload: id }),
    addExpense: (p) => dispatch({ type: 'ADD_EXPENSE', payload: p }),
    updateExpense: (id, d) => dispatch({ type: 'UPDATE_EXPENSE', payload: { id, data: d } }),
    deleteExpense: (id) => dispatch({ type: 'DELETE_EXPENSE', payload: id }),
    addInvestment: (p) => dispatch({ type: 'ADD_INVESTMENT', payload: p }),
    updateInvestment: (id, d) => dispatch({ type: 'UPDATE_INVESTMENT', payload: { id, data: d } }),
    deleteInvestment: (id) => dispatch({ type: 'DELETE_INVESTMENT', payload: id }),
    ...computed,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
