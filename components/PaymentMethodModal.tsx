'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Bundle } from './BundleCard'

interface PaymentMethodModalProps {
  open: boolean
  bundle: Bundle | null
  recipientNumber: string
  email: string
  onClose: () => void
  onSelectPaystack: () => void
  isPaystackLoading: boolean
  isProcessing: boolean
}

export default function PaymentMethodModal({
  open,
  bundle,
  recipientNumber,
  email,
  onClose,
  onSelectPaystack,
  isPaystackLoading,
  isProcessing,
}: PaymentMethodModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!bundle) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-method-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="payment-method-title" className="text-xl font-bold text-black mb-4">
              Select payment method
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Amount: <span className="font-bold text-genius-red">GHS {bundle.price.toFixed(2)}</span>
            </p>

            <button
              type="button"
              onClick={onSelectPaystack}
              disabled={isPaystackLoading || isProcessing}
              className="w-full py-4 px-4 rounded-xl border-2 border-genius-red bg-genius-red/5 text-black font-semibold hover:bg-genius-red/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-genius-red border-t-transparent" />
                  Processing…
                </>
              ) : (
                <>Paystack – Mobile Money</>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-3 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
