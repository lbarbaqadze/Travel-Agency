'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isLoading) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, isLoading, onCancel])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            onClick={() => !isLoading && onCancel()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:border dark:border-neutral-800 dark:bg-neutral-950"
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              aria-label="Close"
              className="cursor-pointer absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>

            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                variant === 'danger' ? 'bg-red-50 dark:bg-red-950/40' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <AlertTriangle className={`h-5 w-5 ${variant === 'danger' ? 'text-red-500' : 'text-neutral-500'}`} />
            </span>

            <h2 id="confirm-modal-title" className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors disabled:opacity-60 ${
                  variant === 'danger'
                    ? 'bg-red-400 hover:bg-red-600'
                    : 'bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
                }`}
              >
                {isLoading ? 'Please wait...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
