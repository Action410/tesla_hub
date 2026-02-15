import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import fs from 'fs'
import path from 'path'

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

function getBundles(): Bundle[] {
  const filePath = path.join(process.cwd(), 'data', 'bundles.json')
  const data = fs.readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(data) as Bundle[]
  return parsed.map((b) => ({
    ...b,
    expires: b.expires ?? false,
    expiry_note: b.expiry_note ?? 'No expiry',
  }))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')
    let bundles = getBundles()
    if (network) {
      bundles = bundles.filter(
        (b) => b.network.toLowerCase() === network.toLowerCase()
      )
    }
    return NextResponse.json(bundles)
  } catch (err) {
    console.error('Bundles API error:', err)
    return NextResponse.json(
      { error: 'Failed to load bundles' },
      { status: 500 }
    )
  }
}
