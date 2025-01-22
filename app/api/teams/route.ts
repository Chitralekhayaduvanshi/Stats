import { NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'
import { ObjectId } from 'mongodb'
import { Team } from '@/types'

interface MongoTeam extends Omit<Team, '_id'> {
  _id: ObjectId
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const teams = await db.collection<MongoTeam>('teams').find({}).toArray()
    
    return NextResponse.json(teams.map(team => ({
      ...team,
      _id: team._id.toString()
    })))
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const data = await request.json()

    const result = await db.collection('teams').insertOne({
      ...data,
      members: [],
      createdAt: new Date()
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...data
    })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { _id, ...data } = await request.json()

    const result = await db.collection('teams').findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString()
    })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { id } = await request.json()

    await db.collection('teams').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 })
  }
} 