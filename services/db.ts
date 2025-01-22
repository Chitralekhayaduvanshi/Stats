import { MongoClient, ObjectId, Document, ModifyResult } from 'mongodb'
import clientPromise from '@/utils/mongodb'
import { Service, Incident, BaseIncident, MongoIncident } from '@/types'

interface MongoService extends Omit<Service, 'id'> {
  _id: ObjectId
}

interface UptimeData extends Document {
  name: string
  uptime: number
}

const getCollection = async () => {
  const client = await clientPromise
  return client.db().collection<MongoIncident>('incidents')
}

export async function getDb() {
  try {
    const client = await clientPromise
    return client.db('status-page')
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw new Error('Failed to connect to database')
  }
}

// Services
export async function getServices() {
  try {
    const db = await getDb()
    const services = await db.collection<MongoService>('services').find({}).toArray()
    return services.map(({ _id, ...service }) => ({
      ...service,
      id: _id.toString()
    }))
  } catch (error) {
    console.error('Error in getServices:', error)
    throw error
  }
}

export async function createService(service: Omit<Service, 'id'>) {
  const db = await getDb()
  const result = await db.collection<MongoService>('services').insertOne(service as any)
  return {
    ...service,
    id: result.insertedId.toString()
  }
}

export async function updateService(id: string, service: Partial<Service>) {
  const db = await getDb()
  await db.collection<MongoService>('services').updateOne(
    { _id: new ObjectId(id) },
    { $set: service }
  )
}

export async function deleteService(id: string) {
  const db = await getDb()
  await db.collection<MongoService>('services').deleteOne({ _id: new ObjectId(id) })
}

// Incidents
export async function getIncidents(): Promise<Incident[]> {
  const collection = await getCollection()
  const incidents = await collection.find({}).toArray()
  return incidents.map(incident => ({
    ...incident,
    _id: incident._id.toString(),
  }))
}

export async function createIncident(data: Partial<BaseIncident>): Promise<Incident> {
  const collection = await getCollection()
  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
    _id: new ObjectId()
  } as MongoIncident)

  const incident = await collection.findOne({ _id: result.insertedId })
  if (!incident) throw new Error('Failed to create incident')

  return {
    ...incident,
    _id: incident._id.toString(),
  }
}

export async function updateIncident(id: string, data: Partial<BaseIncident>): Promise<Incident> {
  const collection = await getCollection()
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw new Error('Incident not found')
  }

  return {
    ...result,
    _id: result._id.toString(),
  }
}

export async function deleteIncident(id: string): Promise<void> {
  const collection = await getCollection()
  await collection.deleteOne({ _id: new ObjectId(id) })
}

// Uptime
export async function getUptime() {
  const db = await getDb()
  const uptime = await db.collection<UptimeData>('uptime').find({}).toArray()
  return uptime.map(({ _id, ...data }) => data)
}

export async function updateUptime(data: { name: string; uptime: number }[]) {
  const db = await getDb()
  await db.collection<UptimeData>('uptime').deleteMany({})
  if (data.length > 0) {
    await db.collection<UptimeData>('uptime').insertMany(data as any[])
  }
} 