'use client'

import { ReactNode, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  glow?: string
  className?: string
  hoverable?: boolean
  noPadding?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, glow, className, hoverable = true, noPadding = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, scale: 1.005 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={cn(
          'rounded-2xl relative overflow-hidden',
          !noPadding && 'p-5',
          className
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: glow
            ? `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px ${glow}`
            : '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        {...props}
      >
        {/* Top shine */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
export default GlassCard
