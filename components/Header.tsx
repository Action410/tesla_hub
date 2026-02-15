'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { motion } from 'framer-motion'
import Logo from './Logo'

const JOIN_CHANNEL_URL =
  process.env.NEXT_PUBLIC_JOIN_CHANNEL_URL ||
  'https://whatsapp.com/channel/0029Vb7oKUA3GJOyFIUXhb3U'
const CONTACT_URL =
  process.env.NEXT_PUBLIC_CONTACT_URL ||
  'mailto:geniushub319@gmail.com'

export default function Header() {
  const { getTotalItems } = useCart()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 md:gap-3 min-w-0">
            <Logo size={40} className="flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-black truncate">
                Genius Data Hub
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Fast & Reliable Data Services
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <a
              href={JOIN_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-genius-red text-white hover:bg-red-700 transition-colors duration-200"
            >
              Join Channel
            </a>
            <div className="relative">
              <ContactMenu contactUrl={CONTACT_URL} />
            </div>
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
              aria-label="Cart"
            >
              <span className="text-xl">🛒</span>
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-genius-red text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

function ContactMenu({ contactUrl }: { contactUrl: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const PHONE = 'tel:0595575955'

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-black text-black hover:bg-gray-100 transition-colors duration-200"
      >
        Contact
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50">
          <a
            href={contactUrl}
            className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded"
          >
            Email: geniushub319@gmail.com
          </a>
          <a
            href={PHONE}
            className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded"
          >
            Call: 0595575955
          </a>
        </div>
      )}
    </div>
  )
}
