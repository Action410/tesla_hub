'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface BundleRow {
  id: string
  network: string
  title: string
  price: number
  expires: boolean
  expiry_note: string
  badge?: string
}

export default function AdminPage() {
  const [bundles, setBundles] = useState<BundleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/bundles')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load bundles')
        return res.json()
      })
      .then(setBundles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-genius-red" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-6">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Bundle admin
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        To change the <strong>expires</strong> flag or edit bundles, update{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">data/bundles.json</code>{' '}
        and redeploy. Default for all bundles is <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">expires: false</code>.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 font-semibold text-black dark:text-white">ID</th>
                <th className="px-4 py-3 font-semibold text-black dark:text-white">Network</th>
                <th className="px-4 py-3 font-semibold text-black dark:text-white">Title</th>
                <th className="px-4 py-3 font-semibold text-black dark:text-white">Price</th>
                <th className="px-4 py-3 font-semibold text-black dark:text-white">Expires</th>
                <th className="px-4 py-3 font-semibold text-black dark:text-white">Expiry note</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{b.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{b.network}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{b.title}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₵{b.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        b.expires ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {b.expires ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{b.expiry_note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
