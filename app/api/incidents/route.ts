import { NextResponse } from 'next/server'
import { Incident } from '@/types'
import { getIncidents, createIncident, updateIncident, deleteIncident } from '@/services/db'

export async function GET() {
  const incidents = await getIncidents()
  return NextResponse.json(incidents)
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