'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePurchaseFlow } from '@/context/PurchaseFlowContext'
import BundleSelectionModal from './BundleSelectionModal'
import ConfirmationModal from './ConfirmationModal'
import PaymentMethodModal from './PaymentMethodModal'
import type { Bundle } from './BundleCard'

function formatSize(sizeMB?: number): string {
  if (sizeMB == null) return 'N/A'
  if (sizeMB >= 1024) return `${sizeMB / 1024}GB`
  return `${sizeMB}MB`
}

export default function PurchaseFlowModals() {
  const router = useRouter()
  const {
    bundle,
    step,
    recipientNumber,
    setRecipientNumber,
    closePurchaseFlow,
    goToConfirmation,
    goBackToSelection,
    goToPayment,
    resetAfterPayment,
  } = usePurchaseFlow()

  const paystackEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || 'receipt@geniusdatahub.com'

  const [isPaystackReady, setIsPaystackReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const scriptUrl = 'https://js.paystack.co/v1/inline.js'
    const existing = document.querySelector(`script[src="${scriptUrl}"]`)
    if (existing) {
      if ((window as any).PaystackPop) setIsPaystackReady(true)
      else existing.addEventListener('load', () => setIsPaystackReady(true))
      return
    }
    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.onload = () => setIsPaystackReady(true)
    script.onerror = () => setIsPaystackReady(false)
    document.body.appendChild(script)
  }, [])

  const openPayment = () => {
    if (typeof window === 'undefined' || !bundle) return
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
    if (!key) {
      alert('Payment is not configured. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.')
      return
    }
    if (!(window as any).PaystackPop) {
      alert('Payment system is still loading. Please wait.')
      return
    }
    setIsProcessing(true)
    const amountInKobo = Math.round(bundle.price * 100)
    const ref = `gdh_${Date.now()}`

    const handler = (window as any).PaystackPop.setup({
      key,
      email: paystackEmail,
      amount: amountInKobo,
      currency: 'GHS',
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Recipient Number', variable_name: 'recipient_number', value: recipientNumber },
          { display_name: 'Bundle ID', variable_name: 'bundle_id', value: bundle.id },
          { display_name: 'Bundle Name', variable_name: 'bundle_name', value: bundle.title },
          { display_name: 'Amount', variable_name: 'amount', value: String(bundle.price) },
          { display_name: 'Network', variable_name: 'network', value: bundle.network },
        ],
      },
      callback: async (response: { reference: string }) => {
        const orderPayload = {
          reference: response.reference,
          items: [{ id: bundle.id, name: bundle.title, price: bundle.price, quantity: 1, network: bundle.network }],
          email: paystackEmail,
          firstName: '',
          lastName: '',
          phone: recipientNumber,
          recipient_number: recipientNumber,
        }
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
          })
        } catch (err) {
          console.error('Order API error:', err)
        }
        setIsProcessing(false)
        resetAfterPayment()
        const bundleSize = formatSize(bundle.sizeMB)
        const params = new URLSearchParams({
          reference: response.reference,
          recipient: recipientNumber,
          bundleName: bundle.title,
          bundleSize,
          amount: bundle.price.toFixed(2),
        })
        router.push(`/success?${params.toString()}`)
      },
      onClose: () => {
        setIsProcessing(false)
      },
    })
    handler.openIframe()
  }

  return (
    <>
      <BundleSelectionModal
        open={step === 'selection'}
        bundle={bundle}
        recipientNumber={recipientNumber}
        onRecipientChange={setRecipientNumber}
        onProceed={goToConfirmation}
        onClose={closePurchaseFlow}
      />
      <ConfirmationModal
        open={step === 'confirmation'}
        bundle={bundle}
        recipientNumber={recipientNumber}
        onCancel={goBackToSelection}
        onContinue={goToPayment}
        onClose={closePurchaseFlow}
      />
      <PaymentMethodModal
        open={step === 'payment'}
        bundle={bundle}
        recipientNumber={recipientNumber}
        onClose={closePurchaseFlow}
        onSelectPaystack={openPayment}
        isPaystackLoading={!isPaystackReady}
        isProcessing={isProcessing}
      />
    </>
  )
}
