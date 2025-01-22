import { NextResponse } from 'next/server'
import { Service } from '@/types'

// This is a mock database. Replace with your actual database implementation
let services: Service[] = []

export async function GET() {
  return NextResponse.json(services)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newService = {
    id: Date.now(),
    ...body
  }
  services.push(newService)
  return NextResponse.json(newService)
}

export async function PUT(request: Request) {
  const body = await request.json()
  services = services.map(service => 
    service.id === body.id ? { ...service, ...body } : service
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  services = services.filter(service => service.id !== id)
  return NextResponse.json({ success: true })
} 