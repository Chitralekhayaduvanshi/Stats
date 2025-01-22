import { NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'
import { ObjectId } from 'mongodb'
import { User } from '@/types'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = await db.collection('users').find({}).toArray()
    
    return NextResponse.json(users.map(user => ({
      ...user,
      _id: user._id.toString()
    })))
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const data = await request.json()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: data.email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const result = await db.collection('users').insertOne({
      ...data,
      role: data.role || 'member',
      createdAt: new Date()
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...data
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { _id, ...data } = await request.json()

    const result = await db.collection('users').findOneAndUpdate(
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString()
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { id } = await request.json()

    await db.collection('users').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
} 