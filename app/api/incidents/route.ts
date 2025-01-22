import { NextResponse } from 'next/server'
import { Incident } from '@/types'

// This is a mock database. Replace with your actual database implementation
let incidents: Incident[] = []

export async function GET() {
  return NextResponse.json(incidents)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newIncident = {
    id: Date.now(),
    createdAt: new Date(),
    ...body
  }
  incidents.push(newIncident)
  return NextResponse.json(newIncident)
}

export async function PUT(request: Request) {
  const body = await request.json()
  incidents = incidents.map(incident => 
    incident.id === body.id ? { ...incident, ...body } : incident
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  incidents = incidents.filter(incident => incident.id !== id)
  return NextResponse.json({ success: true })
} 