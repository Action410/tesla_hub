'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const AGENT_STORAGE_KEY = 'genius_data_hub_agent'
const AGENT_FEE_GHS = 100

interface AgentInfo {
  email: string
  paidAt: string
}

export default function AgentPage() {
  const [agent, setAgent] = useState<AgentInfo | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPaystackReady, setIsPaystackReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(AGENT_STORAGE_KEY)
    if (stored) {
      try {
        setAgent(JSON.parse(stored))
      } catch (_) {}
    }
  }, [])

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
    document.body.appendChild(script)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.fullName.trim()) e.fullName = 'Full name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    if (!formData.phone.trim()) e.phone = 'Phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const payAgentFee = () => {
    if (!validate() || typeof window === 'undefined') return
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
    if (!key) {
      alert('Payment is not configured. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.')
      return
    }
    if (!(window as any).PaystackPop) {
      alert('Payment is loading. Please wait.')
      return
    }
    setIsProcessing(true)
    const ref = `agent_${Date.now()}`

    const handler = (window as any).PaystackPop.setup({
      key,
      email: formData.email,
      amount: AGENT_FEE_GHS * 100,
      currency: 'GHS',
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Full Name', variable_name: 'full_name', value: formData.fullName },
          { display_name: 'Phone', variable_name: 'phone', value: formData.phone },
        ],
      },
      callback: async (response: { reference: string }) => {
        try {
          const res = await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address || undefined,
            }),
          })
          if (res.ok) {
            const data = { email: formData.email, paidAt: new Date().toISOString() }
            localStorage.setItem(AGENT_STORAGE_KEY, JSON.stringify(data))
            setAgent(data)
          }
        } catch (err) {
          console.error(err)
        }
        setIsProcessing(false)
      },
      onClose: () => setIsProcessing(false),
    })
    handler.openIframe()
  }

  if (agent) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Agent Portal
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6"
        >
          <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
            Agent portal is open for you.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            You have paid the agent fee of ₵{AGENT_FEE_GHS}. Use the Store and other dashboard sections to serve customers.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Quick links
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <a href="/" className="text-genius-red hover:underline font-medium">Store</a> – Browse and share bundles
            </li>
            <li>
              <a href="/dashboard/orders" className="text-genius-red hover:underline font-medium">Orders</a> – View orders
            </li>
          </ul>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Become an Agent
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Submit your details and pay a one-time agent fee of <strong className="text-genius-red">₵{AGENT_FEE_GHS}</strong> to get access to the agent portal.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 max-w-lg"
      >
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Personal information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full name <span className="text-genius-red">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-genius-red ${
                errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g. Jane Doe"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email <span className="text-genius-red">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-genius-red ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone <span className="text-genius-red">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-genius-red ${
                errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g. 0501234567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address (optional)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-genius-red"
              placeholder="City or area"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Agent fee: <span className="font-bold text-genius-red">₵{AGENT_FEE_GHS}</span> (one-time). After payment, the agent portal will be open to you.
          </p>
          <button
            type="button"
            onClick={payAgentFee}
            disabled={!isPaystackReady || isProcessing}
            className="w-full py-4 rounded-xl bg-genius-red text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing…' : `Pay agent fee (₵${AGENT_FEE_GHS})`}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
