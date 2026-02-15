'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Bundle } from './BundleCard'

function formatSize(sizeMB?: number): string {
  if (sizeMB == null) return 'N/A'
  if (sizeMB >= 1024) return `${sizeMB / 1024}GB`
  return `${sizeMB}MB`
}

interface ConfirmationModalProps {
  open: boolean
  bundle: Bundle | null
  recipientNumber: string
  onCancel: () => void
  onContinue: () => void
  onClose: () => void
}

export default function ConfirmationModal({
  open,
  bundle,
  recipientNumber,
  onCancel,
  onContinue,
  onClose,
}: ConfirmationModalProps) {
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

  const volume = formatSize(bundle.sizeMB)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto"
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirmation-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl my-auto"
            >
              <div className="flex-1 min-h-0 overflow-y-auto p-6">
                <h2 id="confirmation-title" className="text-xl font-bold text-black mb-4">
                  Confirm before payment
                </h2>

                <div className="space-y-3 mb-6 rounded-xl bg-gray-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network</span>
                    <span className="font-semibold text-black">{bundle.network}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recipient number</span>
                    <span className="font-bold text-genius-red bg-genius-red/10 px-2 py-1 rounded">
                      {recipientNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bundle volume</span>
                    <span className="font-semibold text-black">{volume}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Charge</span>
                    <span className="font-bold text-genius-red">GHS {bundle.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 mb-6">
                  <p className="font-bold text-amber-900 mb-2">TAKE NOTE !!!</p>
                  <p className="text-sm text-amber-900 mb-2">
                    Make sure the number entered is correct. There will be <strong>NO REVERSAL or REFUND</strong> after
                    completing this transaction.
                  </p>
                  <p className="text-sm text-amber-900 mb-2">
                    After paying with Mobile Money, please review your transaction history in your MoMo app to confirm your order.
                  </p>
                  <p className="text-sm font-semibold text-amber-900">
                    NB: This action cannot be undone after payment.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4 pt-0 flex-shrink-0 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  className="flex-1 py-3 rounded-xl bg-genius-red text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
