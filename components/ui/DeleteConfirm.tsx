'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X } from 'lucide-react'

interface DeleteConfirmProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  itemName?: string
}

export default function DeleteConfirm({ isOpen, onConfirm, onCancel, itemName }: DeleteConfirmProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onCancel}
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="relative z-10 w-full max-w-sm rounded-2xl p-6"
            style={{
              background: 'rgba(15, 22, 41, 0.98)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(248, 113, 113, 0.15)' }}
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Excluir registro</h3>
                <p className="text-xs text-slate-400">{itemName || 'Este item será removido'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                }}
              >
                Excluir
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
