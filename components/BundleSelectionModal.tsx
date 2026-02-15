'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Bundle } from './BundleCard'
import { isValidGhanaNumber } from '@/context/PurchaseFlowContext'

function formatSize(sizeMB?: number): string {
  if (sizeMB == null) return ''
  if (sizeMB >= 1024) return `${sizeMB / 1024}GB`
  return `${sizeMB}MB`
}

interface BundleSelectionModalProps {
  open: boolean
  bundle: Bundle | null
  recipientNumber: string
  email: string
  onRecipientChange: (value: string) => void
  onEmailChange: (value: string) => void
  onProceed: () => void
  onClose: () => void
}

export default function BundleSelectionModal({
  open,
  bundle,
  recipientNumber,
  email,
  onRecipientChange,
  onEmailChange,
  onProceed,
  onClose,
}: BundleSelectionModalProps) {
  const validNumber = isValidGhanaNumber(recipientNumber)
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canProceed = validNumber && validEmail

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bundle-selection-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="bundle-selection-title" className="text-xl font-bold text-black mb-4">
              Confirm bundle
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Bundle</p>
                <p className="font-semibold text-black">{bundle.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-2xl font-bold text-genius-red">
                  GHS {bundle.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label htmlFor="recipient-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Number <span className="text-genius-red">*</span>
                </label>
                <input
                  id="recipient-number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="05XXXXXXXX"
                  value={recipientNumber}
                  onChange={(e) => onRecipientChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-genius-red ${
                    recipientNumber && !validNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {recipientNumber && !validNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    Enter a valid Ghana number (05 followed by 8 digits)
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="payer-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your email (for receipt) <span className="text-genius-red">*</span>
                </label>
                <input
                  id="payer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-genius-red ${
                    email && !validEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {email && !validEmail && (
                  <p className="text-sm text-red-600 mt-1">Enter a valid email</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onProceed}
                disabled={!canProceed}
                className="flex-1 py-3 rounded-xl bg-genius-red text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
