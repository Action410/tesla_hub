import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  network?: string
}

export interface CreateOrderBody {
  reference: string
  items: OrderItem[]
  email: string
  firstName?: string
  lastName?: string
  phone: string
  recipient_number?: string
  address?: string
  city?: string
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')

function ensureOrdersFile() {
  const dir = path.dirname(ORDERS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]')
}

function readOrders(): Array<Record<string, unknown>> {
  ensureOrdersFile()
  const data = fs.readFileSync(ORDERS_FILE, 'utf-8')
  return JSON.parse(data || '[]')
}

function writeOrders(orders: Array<Record<string, unknown>>) {
  ensureOrdersFile()
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

async function callSupplierApi(
  _items: OrderItem[],
  _phone: string
): Promise<{ success: boolean; message?: string }> {
  const url = process.env.DATA_SUPPLIER_API_URL
  const key = process.env.DATA_SUPPLIER_API_KEY
  if (!url || !key) {
    return { success: true, message: 'Supplier API not configured; order recorded.' }
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ items: _items, phone: _phone }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { success: false, message: text || 'Supplier API error' }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Supplier request failed'
    return { success: false, message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderBody
    const { reference, items, email, firstName, lastName, phone, recipient_number, address, city } = body
    if (!reference || !items?.length || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: reference, items, email, phone' },
        { status: 400 }
      )
    }
    const recipientPhone = recipient_number || phone

    const supplierResult = await callSupplierApi(items, recipientPhone)
    const status = supplierResult.success ? 'completed' : 'pending'
    const order = {
      reference,
      items,
      email,
      firstName,
      lastName,
      phone,
      recipient_number: recipient_number ?? undefined,
      address,
      city,
      status,
      supplierMessage: supplierResult.message,
      createdAt: new Date().toISOString(),
    }

    const orders = readOrders()
    orders.push(order)
    writeOrders(orders)

    return NextResponse.json({
      reference,
      status,
      message: supplierResult.success
        ? 'Order recorded and processed.'
        : 'Order recorded; delivery may be pending. Our team will follow up.',
    })
  } catch (err) {
    console.error('Orders API error:', err)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
