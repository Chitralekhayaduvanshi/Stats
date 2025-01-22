import { NextResponse } from 'next/server'
import { Service } from '@/types'
import { getServices, createService, updateService, deleteService } from '@/services/db'

export async function GET() {
  const services = await getServices()
  return NextResponse.json(services)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newService = await createService(body)
  return NextResponse.json(newService)
}

export async function PUT(request: Request) {
  const body = await request.json()
  await updateService(body.id, body)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteService(id)
  return NextResponse.json({ success: true })
} 