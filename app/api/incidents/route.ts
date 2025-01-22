import { NextResponse } from 'next/server'
import { Incident } from '@/types'
import { getIncidents, createIncident, updateIncident, deleteIncident } from '@/services/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const incidents = await getIncidents()
    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const newIncident = await createIncident(body)
  return NextResponse.json(newIncident)
}

export async function PUT(request: Request) {
  const body = await request.json()
  await updateIncident(body.id, body)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteIncident(id)
  return NextResponse.json({ success: true })
} 