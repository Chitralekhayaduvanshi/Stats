import { NextResponse } from 'next/server'
import { Incident } from '@/types'
import { getIncidents, createIncident, updateIncident, deleteIncident } from '@/services/db'
import clientPromise from '@/utils/mongodb'
import { ObjectId } from 'mongodb'

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
    const client = await clientPromise
    const db = client.db()
    const { id, title, status, serviceId } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await db.collection('incidents').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          status,
          serviceId,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result || !result.value) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
    }

    return NextResponse.json(result.value)
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