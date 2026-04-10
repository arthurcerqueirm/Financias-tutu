'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  currency?: boolean
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

export default function AnimatedCounter({
  value,
  currency = false,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0.1,
  })
  const [displayValue, setDisplayValue] = useState('0')
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (currency) {
        setDisplayValue(formatCurrency(latest))
      } else {
        setDisplayValue(
          `${prefix}${latest.toFixed(decimals)}${suffix}`
        )
      }
    })
    return unsubscribe
  }, [springValue, currency, decimals, prefix, suffix])

  // Also react to value changes after initial mount
  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  )
}
