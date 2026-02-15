'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Bundle } from '@/components/BundleCard'

type Step = 'closed' | 'selection' | 'confirmation' | 'payment'

interface PurchaseFlowState {
  bundle: Bundle | null
  recipientNumber: string
  step: Step
}

interface PurchaseFlowContextType extends PurchaseFlowState {
  openPurchaseFlow: (bundle: Bundle) => void
  closePurchaseFlow: () => void
  setRecipientNumber: (value: string) => void
  goToConfirmation: () => void
  goBackToSelection: () => void
  goToPayment: () => void
  resetAfterPayment: () => void
}

const initialState: PurchaseFlowState = {
  bundle: null,
  recipientNumber: '',
  step: 'closed',
}

const PurchaseFlowContext = createContext<PurchaseFlowContextType | undefined>(undefined)

export function PurchaseFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PurchaseFlowState>(initialState)

  const openPurchaseFlow = useCallback((bundle: Bundle) => {
    setState({
      bundle,
      recipientNumber: '',
      step: 'selection',
    })
  }, [])

  const closePurchaseFlow = useCallback(() => {
    setState(initialState)
  }, [])

  const setRecipientNumber = useCallback((value: string) => {
    setState((s) => ({ ...s, recipientNumber: value }))
  }, [])

  const goToConfirmation = useCallback(() => {
    setState((s) => ({ ...s, step: 'confirmation' }))
  }, [])

  const goBackToSelection = useCallback(() => {
    setState((s) => ({ ...s, step: 'selection' }))
  }, [])

  const goToPayment = useCallback(() => {
    setState((s) => ({ ...s, step: 'payment' }))
  }, [])

  const resetAfterPayment = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <PurchaseFlowContext.Provider
      value={{
        ...state,
        openPurchaseFlow,
        closePurchaseFlow,
        setRecipientNumber,
        goToConfirmation,
        goBackToSelection,
        goToPayment,
        resetAfterPayment,
      }}
    >
      {children}
    </PurchaseFlowContext.Provider>
  )
}

export function usePurchaseFlow() {
  const ctx = useContext(PurchaseFlowContext)
  if (ctx === undefined) throw new Error('usePurchaseFlow must be used within PurchaseFlowProvider')
  return ctx
}

/** Ghana mobile: 10 digits, starts with 05 */
export function isValidGhanaNumber(value: string): boolean {
  return /^05\d{8}$/.test(value.replace(/\s/g, ''))
}
