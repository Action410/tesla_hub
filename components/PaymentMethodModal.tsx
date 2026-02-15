'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Bundle } from './BundleCard'

interface PaymentMethodModalProps {
  open: boolean
  bundle: Bundle | null
  recipientNumber: string
  onClose: () => void
  onSelectPaystack: () => void
  isPaystackLoading: boolean
  isProcessing: boolean
}

export default function PaymentMethodModal({
  open,
  bundle,
  recipientNumber,
  onClose,
  onSelectPaystack,
  isPaystackLoading,
  isProcessing,
}: PaymentMethodModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
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
            className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto"
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-method-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl my-auto"
            >
              <div className="flex-1 min-h-0 overflow-y-auto p-6">
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
