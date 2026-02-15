'use client'

import { useCart } from '@/context/CartContext'
import { usePurchaseFlow } from '@/context/PurchaseFlowContext'
import type { Product } from '@/context/CartContext'
import { motion } from 'framer-motion'

export interface Bundle {
  id: string
  network: string
  title: string
  sizeMB?: number
  price: number
  badge?: string
  expires: boolean
  expiry_note: string
  description?: string
}

interface BundleCardProps {
  bundle: Bundle
}

function formatSize(sizeMB?: number): string {
  if (sizeMB == null) return ''
  if (sizeMB >= 1024) return `${sizeMB / 1024}GB`
  return `${sizeMB}MB`
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const { addToCart } = useCart()
  const { openPurchaseFlow } = usePurchaseFlow()
  const isAfa = bundle.network.toUpperCase() === 'AFA'
  const product: Product = {
    id: bundle.id,
    name: bundle.title,
    price: bundle.price,
    image: '',
    description: bundle.description,
    network: bundle.network,
    badge: bundle.badge,
    expires: bundle.expires,
    expiry_note: bundle.expiry_note,
    sizeMB: bundle.sizeMB,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-md border-2 overflow-hidden ${
        isAfa ? 'border-blue-400' : 'border-gray-200 hover:border-genius-red'
      } transition-all duration-300`}
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {bundle.badge && (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                isAfa
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-genius-red/10 text-genius-red border border-genius-red/30'
              }`}
            >
              {bundle.badge}
            </span>
          )}
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {bundle.expires ? bundle.expiry_note : 'No Expiry'}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-black mb-1">
          {bundle.title}
        </h3>
        {bundle.sizeMB != null && (
          <p className="text-sm text-gray-500 mb-2">{formatSize(bundle.sizeMB)}</p>
        )}
        {bundle.description && (
          <p className="text-sm text-gray-600 mb-4">{bundle.description}</p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-2">
          <p className="text-2xl font-bold text-genius-red">
            ₵{bundle.price.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openPurchaseFlow(bundle)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-genius-red text-white font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Buy Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addToCart(product)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border-2 border-genius-red text-genius-red font-semibold hover:bg-genius-red/5 transition-colors duration-200"
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
