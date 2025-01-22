import { ObjectId } from 'mongodb'

export interface Service {
  id: string
  name: string
  status: "operational" | "degraded" | "outage"
}

// Base incident type without ID fields
export interface BaseIncident {
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: Date
  serviceId: string
  updatedAt?: Date
}

// MongoDB incident type
export interface MongoIncident extends BaseIncident {
  _id: ObjectId
}

// API incident type
export interface Incident extends BaseIncident {
  _id: string
  id?: string
}

export interface User {
  _id: string
  email: string
  name: string
  role: "admin" | "member"
  teamId?: string
  createdAt: Date
  updatedAt?: Date
}

export interface Team {
  _id: string
  name: string
  description?: string
  members: string[] // User IDs
  createdAt: Date
  updatedAt?: Date
} 