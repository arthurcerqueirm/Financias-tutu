'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-mesh">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
