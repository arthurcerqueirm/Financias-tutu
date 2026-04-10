'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  BarChart3,
  Landmark,
  Wallet,
} from 'lucide-react'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#8B5CF6' },
  { href: '/renda', icon: TrendingUp, label: 'Renda', color: '#34D399' },
  { href: '/gastos', icon: CreditCard, label: 'Gastos', color: '#F87171' },
  { href: '/investimentos', icon: BarChart3, label: 'Investimentos', color: '#60A5FA' },
  { href: '/patrimonio', icon: Landmark, label: 'Patrimônio', color: '#FBBF24' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-40"
      style={{
        background: 'rgba(8, 11, 22, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center glow-purple"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white leading-tight">Financias</h1>
            <p className="text-xs text-slate-400">Gestão Pessoal</p>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${item.color}18, ${item.color}08)`
                      : 'transparent',
                    border: isActive
                      ? `1px solid ${item.color}30`
                      : '1px solid transparent',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                      style={{ background: item.color }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isActive ? `${item.color}25` : 'rgba(255,255,255,0.05)',
                      boxShadow: isActive ? `0 0 12px ${item.color}30` : 'none',
                    }}
                  >
                    <item.icon
                      className="w-4 h-4 transition-all duration-200"
                      style={{ color: isActive ? item.color : '#64748B' }}
                    />
                  </div>
                  <span
                    className="text-sm font-medium transition-all duration-200"
                    style={{ color: isActive ? item.color : '#64748B' }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 mx-3 mb-4 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.12)' }}>
        <p className="text-xs text-slate-500 text-center">
          Dados salvos localmente
          <br />
          <span className="text-purple-400/60">100% privado & seguro</span>
        </p>
      </div>
    </motion.aside>
  )
}
