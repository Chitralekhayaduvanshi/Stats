import clientPromise from '@/utils/mongodb'
import { Service, Incident } from '@/types'
import { ObjectId } from 'mongodb'

export async function getDb() {
  const client = await clientPromise
  return client.db('status-page')
}

// Services
export async function getServices() {
  const db = await getDb()
  const services = await db.collection('services').find({}).toArray()
  return services.map(({ _id, ...service }) => ({
    ...service,
    id: _id.toString()
  })) as Service[]
}

export async function createService(service: Omit<Service, 'id'>) {
  const db = await getDb()
  const result = await db.collection('services').insertOne(service)
  return {
    ...service,
    id: result.insertedId.toString()
  } as Service
}

export async function updateService(id: string, service: Partial<Service>) {
  const db = await getDb()
  await db.collection('services').updateOne(
    { _id: new ObjectId(id) },
    { $set: service }
  )
}

export async function deleteService(id: string) {
  const db = await getDb()
  await db.collection('services').deleteOne({ _id: new ObjectId(id) })
}

// Incidents
export async function getIncidents() {
  const db = await getDb()
  const incidents = await db.collection('incidents').find({}).toArray()
  return incidents.map(({ _id, ...incident }) => ({
    ...incident,
    id: _id.toString(),
    createdAt: new Date(incident.createdAt)
  })) as Incident[]
}

export async function createIncident(incident: Omit<Incident, 'id'>) {
  const db = await getDb()
  const result = await db.collection('incidents').insertOne({
    ...incident,
    createdAt: new Date()
  })
  return {
    ...incident,
    id: result.insertedId.toString()
  } as Incident
}

export async function updateIncident(id: string, incident: Partial<Incident>) {
  const db = await getDb()
  await db.collection('incidents').updateOne(
    { _id: new ObjectId(id) },
    { $set: incident }
  )
}

export async function deleteIncident(id: string) {
  const db = await getDb()
  await db.collection('incidents').deleteOne({ _id: new ObjectId(id) })
}

// Uptime
export async function getUptime() {
  const db = await getDb()
  const uptime = await db.collection('uptime').find({}).toArray()
  return uptime.map(({ _id, ...data }) => data)
}

export async function updateUptime(data: { name: string; uptime: number }[]) {
  const db = await getDb()
  await db.collection('uptime').deleteMany({})
  if (data.length > 0) {
    await db.collection('uptime').insertMany(data)
  }
} 