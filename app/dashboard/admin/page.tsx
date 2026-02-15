'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/agent')
  }, [router])
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-gray-600 dark:text-gray-400">Redirecting to Agent portal…</p>
    </div>
  )
}
