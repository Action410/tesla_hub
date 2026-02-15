'use client'

import BundleCard from './BundleCard'
import type { Bundle } from './BundleCard'

interface AfaBundleCardProps {
  bundle: Bundle
}

export default function AfaBundleCard({ bundle }: AfaBundleCardProps) {
  return (
    <div className="relative">
      <div className="absolute -top-1 -right-1 z-10 px-2 py-0.5 rounded bg-blue-500 text-white text-xs font-bold">
        AFA
      </div>
      <BundleCard bundle={bundle} />
    </div>
  )
}
