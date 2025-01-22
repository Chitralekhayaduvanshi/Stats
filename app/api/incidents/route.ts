import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { BaseIncident } from '@/types'
import { getIncidents, createIncident, updateIncident, deleteIncident } from '@/services/db'
import clientPromise from '@/utils/mongodb'

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
  try {
    const { id, ...data } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updatedIncident = await updateIncident(id, data as Partial<BaseIncident>)
    return NextResponse.json(updatedIncident)
  } catch (error) {
    console.error('Error updating incident:', error)
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteIncident(id)
  return NextResponse.json({ success: true })
} 