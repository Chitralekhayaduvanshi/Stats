export interface Service {
  id: number
  name: string
  status: "operational" | "degraded" | "outage"
}

export interface Incident {
  id: number
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: Date
} 