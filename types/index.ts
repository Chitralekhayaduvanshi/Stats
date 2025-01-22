export interface Service {
  id: string
  name: string
  status: "operational" | "degraded" | "outage"
}

export interface Incident {
  _id: string
  id: string
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: Date
  serviceId: string
  updatedAt?: Date
} 