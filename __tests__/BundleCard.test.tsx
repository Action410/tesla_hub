import React from 'react'
import { render, screen } from '@testing-library/react'
import BundleCard from '@/components/BundleCard'
import { CartProvider } from '@/context/CartContext'

const bundleNoExpiry = {
  id: 'mtn_1gb',
  network: 'MTN',
  title: '1GB MTN',
  sizeMB: 1024,
  price: 5,
  badge: 'BEST SELLING',
  expires: false,
  expiry_note: 'No expiry',
  description: '1GB data bundle',
}

const bundleWithExpiry = {
  id: 'test_exp',
  network: 'MTN',
  title: 'Test Expiring',
  sizeMB: 512,
  price: 3,
  badge: 'FAST DELIVERY',
  expires: true,
  expiry_note: 'Valid 30 days',
  description: 'Expiring bundle',
}

function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>)
}

describe('BundleCard', () => {
  it('renders "No Expiry" badge when expires is false', () => {
    renderWithCart(<BundleCard bundle={bundleNoExpiry} />)
    expect(screen.getByText('No Expiry')).toBeInTheDocument()
  })

  it('renders expiry_note when expires is true', () => {
    renderWithCart(<BundleCard bundle={bundleWithExpiry} />)
    expect(screen.getByText('Valid 30 days')).toBeInTheDocument()
  })

  it('renders bundle title and price', () => {
    renderWithCart(<BundleCard bundle={bundleNoExpiry} />)
    expect(screen.getByText('1GB MTN')).toBeInTheDocument()
    expect(screen.getByText('₵5.00')).toBeInTheDocument()
  })

  it('renders Add to Cart button', () => {
    renderWithCart(<BundleCard bundle={bundleNoExpiry} />)
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })
})
