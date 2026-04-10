import { FinanceData } from './types'
import { generateId } from './utils'

// Bump the key version to wipe old demo data and load real data
const STORAGE_KEY = 'financias_tutu_v2'

function getDefaultData(): FinanceData {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  // Helper: date offset in months from today
  const m = (offset: number) => {
    const d = new Date(today)
    d.setMonth(d.getMonth() + offset)
    return d
  }

  // Helper: fixed date string
  const d = (y: number, mo: number, day: number) =>
    new Date(y, mo - 1, day).toISOString().split('T')[0]

  return {
    // ─── RENDA ──────────────────────────────────────────────────
    // Salário R$2.500/mês nos últimos 6 meses
    // + dividendos e rendimentos de RF por ativo, mês a mês
    income: [
      // ── Salário ──────────────────────
      { id: generateId(), description: 'Salário', amount: 2500, category: 'salary', date: fmt(m(0)),  recurring: true },
      { id: generateId(), description: 'Salário', amount: 2500, category: 'salary', date: fmt(m(-1)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 2500, category: 'salary', date: fmt(m(-2)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 2500, category: 'salary', date: fmt(m(-3)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 2500, category: 'salary', date: fmt(m(-4)), recurring: true },
      { id: generateId(), description: 'Salário', amount: 2500, category: 'salary', date: fmt(m(-5)), recurring: true },

      // ── Abril/2026 — dividendos reais ─
      { id: generateId(), description: 'Dividendo HGLG11 (4 cotas × R$1,10)', amount: 4.40,  category: 'dividend', date: d(2026, 4, 8),  recurring: false },
      { id: generateId(), description: 'Dividendo MXRF11 (102 cotas × R$0,095)', amount: 9.69, category: 'dividend', date: d(2026, 4, 8), recurring: false },
      { id: generateId(), description: 'Dividendo XPML11 (5 cotas × R$0,92)',  amount: 4.60,  category: 'dividend', date: d(2026, 4, 8),  recurring: false },
      { id: generateId(), description: 'Rendimento Nubank Caixinha Turbo',       amount: 27.38, category: 'dividend', date: d(2026, 4, 5),  recurring: false },
      { id: generateId(), description: 'Rendimento CDB Banco CNH Capital',       amount: 12.15, category: 'dividend', date: d(2026, 4, 5),  recurring: false },

      // ── Março/2026 — MXRF11 ainda pagava R$0,10 ──────────────
      { id: generateId(), description: 'Dividendo HGLG11 (4 cotas × R$1,10)',   amount: 4.40,  category: 'dividend', date: d(2026, 3, 10), recurring: false },
      { id: generateId(), description: 'Dividendo MXRF11 (102 cotas × R$0,10)',  amount: 10.20, category: 'dividend', date: d(2026, 3, 10), recurring: false },
      { id: generateId(), description: 'Dividendo XPML11 (5 cotas × R$0,92)',   amount: 4.60,  category: 'dividend', date: d(2026, 3, 10), recurring: false },
      { id: generateId(), description: 'Rendimento Nubank Caixinha Turbo',       amount: 26.80, category: 'dividend', date: d(2026, 3, 5),  recurring: false },
      { id: generateId(), description: 'Rendimento CDB Banco CNH Capital',       amount: 11.50, category: 'dividend', date: d(2026, 3, 5),  recurring: false },

      // ── Fevereiro/2026 ─────────────────────────────────────────
      { id: generateId(), description: 'Dividendo HGLG11 (4 cotas × R$1,10)',   amount: 4.40,  category: 'dividend', date: d(2026, 2, 10), recurring: false },
      { id: generateId(), description: 'Dividendo MXRF11 (102 cotas × R$0,10)',  amount: 10.20, category: 'dividend', date: d(2026, 2, 10), recurring: false },
      { id: generateId(), description: 'Dividendo XPML11 (5 cotas × R$0,92)',   amount: 4.60,  category: 'dividend', date: d(2026, 2, 10), recurring: false },
      { id: generateId(), description: 'Rendimento Nubank Caixinha Turbo',       amount: 26.20, category: 'dividend', date: d(2026, 2, 5),  recurring: false },
      { id: generateId(), description: 'Rendimento CDB Banco CNH Capital',       amount: 10.80, category: 'dividend', date: d(2026, 2, 5),  recurring: false },

      // ── Janeiro/2026 — CDB CNH começa ─────────────────────────
      { id: generateId(), description: 'Dividendo HGLG11 (4 cotas × R$1,10)',   amount: 4.40,  category: 'dividend', date: d(2026, 1, 10), recurring: false },
      { id: generateId(), description: 'Dividendo MXRF11 (102 cotas × R$0,10)',  amount: 10.20, category: 'dividend', date: d(2026, 1, 10), recurring: false },
      { id: generateId(), description: 'Dividendo XPML11 (5 cotas × R$0,92)',   amount: 4.60,  category: 'dividend', date: d(2026, 1, 10), recurring: false },
      { id: generateId(), description: 'Rendimento Nubank Caixinha Turbo',       amount: 25.60, category: 'dividend', date: d(2026, 1, 5),  recurring: false },
      { id: generateId(), description: 'Rendimento CDB Banco CNH Capital',       amount: 9.50,  category: 'dividend', date: d(2026, 1, 15), recurring: false },

      // ── Dezembro/2025 — XPML11 entra ─────────────────────────
      { id: generateId(), description: 'Dividendo HGLG11 (4 cotas × R$1,10)',   amount: 4.40,  category: 'dividend', date: d(2025, 12, 10), recurring: false },
      { id: generateId(), description: 'Dividendo MXRF11 (102 cotas × R$0,10)',  amount: 10.20, category: 'dividend', date: d(2025, 12, 10), recurring: false },
      { id: generateId(), description: 'Dividendo XPML11 (5 cotas × R$0,92)',   amount: 4.60,  category: 'dividend', date: d(2025, 12, 10), recurring: false },
      { id: generateId(), description: 'Rendimento Nubank Caixinha Turbo',       amount: 25.00, category: 'dividend', date: d(2025, 12, 5),  recurring: false },

      // ── Novembro/2025 — MXRF11 entra ─────────────────────────
      { id: generateId(), description: 'Dividendo HGLG11 (4 cotas × R$1,10)',   amount: 4.40,  category: 'dividend', date: d(2025, 11, 10), recurring: false },
      { id: generateId(), description: 'Dividendo MXRF11 (102 cotas × R$0,10)',  amount: 10.20, category: 'dividend', date: d(2025, 11, 10), recurring: false },
      { id: generateId(), description: 'Rendimento Nubank Caixinha Turbo',       amount: 24.40, category: 'dividend', date: d(2025, 11, 5),  recurring: false },
    ],

    // ─── GASTOS ─────────────────────────────────────────────────
    // Deixado vazio — adicione seus gastos reais pelo app
    expenses: [],

    // ─── INVESTIMENTOS ──────────────────────────────────────────
    // Dados reais de Abril/2026 (Notion)
    // invested = custo médio de compra  |  currentValue = valor atual
    investments: [
      {
        id: generateId(),
        name: 'Nubank Caixinha Turbo',
        type: 'fixed_income',
        invested: 2200,      // depósitos realizados
        currentValue: 2320,  // saldo atual (inclui rendimento acumulado)
        date: d(2025, 8, 1),
        notes: '115% CDI · ~15,12% a.a. · Liquidez diária · Coberto pelo FGC · R$27,38/mês',
      },
      {
        id: generateId(),
        name: 'CDB Banco CNH Capital',
        type: 'fixed_income',
        invested: 1000,      // aporte inicial
        currentValue: 1168,  // saldo atual
        date: d(2026, 1, 10),
        notes: '~CDI (13,15% a.a.) · Coberto pelo FGC até R$250.000 · R$12,15/mês',
      },
      {
        id: generateId(),
        name: 'HGLG11 — Pátria Logística',
        type: 'real_estate',
        invested: 648,      // 4 cotas × ~R$162 (preço médio de compra)
        currentValue: 627,  // 4 cotas × R$156,16 (cotação atual)
        date: d(2025, 10, 15),
        notes: '4 cotas · Cotação R$156,16 · DY 8,42% · P/VP 0,95 · Guidance 2S26: R$1,17 (+6,36%) · R$4,40/mês',
      },
      {
        id: generateId(),
        name: 'MXRF11 — Maxi Renda',
        type: 'real_estate',
        invested: 1010,   // 102 cotas × ~R$9,90 (preço médio de compra)
        currentValue: 995, // 102 cotas × R$9,72 (cotação atual)
        date: d(2025, 11, 20),
        notes: '102 cotas · Cotação R$9,72 · DY 12,29% · 80% em CRIs (IPCA+9,78%) · 1,4M cotistas · Div. cortado abr/26: R$0,10→R$0,095 · R$9,69/mês',
      },
      {
        id: generateId(),
        name: 'XPML11 — XP Malls',
        type: 'real_estate',
        invested: 540,  // 5 cotas × R$108 (preço médio de compra)
        currentValue: 555, // 5 cotas × R$109,75 (cotação atual)
        date: d(2025, 12, 10),
        notes: '5 cotas · Cotação R$109,75 · DY 10,09% · 28 shoppings · P/VP 1,00 · Patrimônio ~R$6,3bi · R$4,60/mês',
      },
      {
        id: generateId(),
        name: 'IVVB11 — iShares S&P 500',
        type: 'funds',
        invested: 1054,  // 3 cotas × ~R$351 (preço médio de compra ~12M atrás)
        currentValue: 1160, // 3 cotas × R$392 (cotação atual, +10,08% em 12M)
        date: d(2025, 4, 10),
        notes: '3 cotas · Cotação R$392 · +10,08% em 12M · Taxa adm. 0,23% a.a. · Reinveste dividendos · Exposição ao dólar + 500 maiores EUA',
      },
      {
        id: generateId(),
        name: 'Caixa — Conta XP',
        type: 'other',
        invested: 1500,
        currentValue: 1500,
        date: fmt(m(0)),
        notes: 'Reserva para oportunidades · Sem rendimento · Meta: R$10.000 para ativar XP Global · Radar: KNCR11, BTLG11, TRXF11',
      },
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
