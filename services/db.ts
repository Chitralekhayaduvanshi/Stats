import { MongoClient, ObjectId, Document } from 'mongodb'
import clientPromise from '@/utils/mongodb'
import { Service, Incident } from '@/types'

interface MongoService extends Omit<Service, 'id'> {
  _id: ObjectId
}

interface MongoIncident extends Omit<Incident, 'id'> {
  _id: ObjectId
}

export async function getDb() {
  const client = await clientPromise
  return client.db('status-page')
}

// Services
export async function getServices() {
  const db = await getDb()
  const services = await db.collection<MongoService>('services').find({}).toArray()
  return services.map(({ _id, ...service }) => ({
    ...service,
    id: _id.toString()
  })) as Service[]
}

export async function createService(service: Omit<Service, 'id'>) {
  const db = await getDb()
  const result = await db.collection<MongoService>('services').insertOne(service as any)
  return {
    ...service,
    id: result.insertedId.toString()
  } as Service
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
export async function getIncidents() {
  const db = await getDb()
  const incidents = await db.collection<MongoIncident>('incidents').find({}).toArray()
  return incidents.map(({ _id, ...incident }) => ({
    ...incident,
    id: _id.toString(),
    createdAt: new Date(incident.createdAt)
  })) as Incident[]
}

export async function createIncident(incident: Omit<Incident, 'id'>) {
  const db = await getDb()
  const result = await db.collection<MongoIncident>('incidents').insertOne({
    ...incident,
    createdAt: new Date()
  } as any)
  return {
    ...incident,
    id: result.insertedId.toString()
  } as Incident
}

export async function updateIncident(id: string, incident: Partial<Incident>) {
  const db = await getDb()
  await db.collection<MongoIncident>('incidents').updateOne(
    { _id: new ObjectId(id) },
    { $set: incident }
  )
}

export async function deleteIncident(id: string) {
  const db = await getDb()
  await db.collection<MongoIncident>('incidents').deleteOne({ _id: new ObjectId(id) })
}

// Uptime
interface UptimeData extends Document {
  name: string
  uptime: number
}

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