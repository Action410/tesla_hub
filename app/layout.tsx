import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingSupportButton from '@/components/FloatingSupportButton'

export const metadata: Metadata = {
  title: 'Genius Data Hub - Fast, Secure, Reliable Digital Services',
  description: 'Fast & Reliable Data Services. No expiry bundles.',
  icons: {
    icon: '/assets/genius-data-hub-logo.svg',
    shortcut: '/assets/genius-data-hub-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingSupportButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

