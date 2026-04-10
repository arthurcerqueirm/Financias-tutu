'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  BarChart3,
  Landmark,
} from 'lucide-react'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Início', color: '#8B5CF6' },
  { href: '/renda', icon: TrendingUp, label: 'Renda', color: '#34D399' },
  { href: '/gastos', icon: CreditCard, label: 'Gastos', color: '#F87171' },
  { href: '/investimentos', icon: BarChart3, label: 'Invest.', color: '#60A5FA' },
  { href: '/patrimonio', icon: Landmark, label: 'Patrimônio', color: '#FBBF24' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{
        background: 'rgba(8, 11, 22, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl relative"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: `${item.color}12` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative">
                  <item.icon
                    className="w-5 h-5 transition-all duration-300"
                    style={{
                      color: isActive ? item.color : '#475569',
                      filter: isActive ? `drop-shadow(0 0 8px ${item.color}80)` : 'none',
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                    />
                  )}
                </div>

                <span
                  className="text-[10px] font-medium transition-all duration-300 relative z-10"
                  style={{ color: isActive ? item.color : '#475569' }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
