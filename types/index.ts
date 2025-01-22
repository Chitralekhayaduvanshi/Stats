export interface Service {
  id: string
  name: string
  status: "operational" | "degraded" | "outage"
}

export interface Incident {
  id: string
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: Date
} 