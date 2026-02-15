import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const AGENTS_FILE = path.join(process.cwd(), 'data', 'agents.json')

export interface RegisterAgentBody {
  reference: string
  fullName: string
  email: string
  phone: string
  address?: string
}

function ensureAgentsFile() {
  const dir = path.dirname(AGENTS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(AGENTS_FILE)) fs.writeFileSync(AGENTS_FILE, '[]')
}

function readAgents(): Array<Record<string, unknown>> {
  ensureAgentsFile()
  const data = fs.readFileSync(AGENTS_FILE, 'utf-8')
  return JSON.parse(data || '[]')
}

function writeAgents(agents: Array<Record<string, unknown>>) {
  ensureAgentsFile()
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterAgentBody
    const { reference, fullName, email, phone, address } = body
    if (!reference || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: reference, fullName, email, phone' },
        { status: 400 }
      )
    }

    const agent = {
      reference,
      fullName,
      email,
      phone,
      address,
      paidAt: new Date().toISOString(),
      feeAmount: 100,
    }

    const agents = readAgents()
    if (agents.some((a) => (a.reference as string) === reference || (a.email as string) === email)) {
      return NextResponse.json({ success: true, message: 'Agent already registered.' })
    }
    agents.push(agent)
    writeAgents(agents)

    return NextResponse.json({
      success: true,
      message: 'Agent registered. Portal access granted.',
    })
  } catch (err) {
    console.error('Agents API error:', err)
    return NextResponse.json(
      { error: 'Failed to register agent' },
      { status: 500 }
    )
  }
}
