"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Service, Incident } from "@/types"
import { format } from "date-fns"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, incidentsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/incidents')
      ])
      
      const [servicesData, incidentsData] = await Promise.all([
        servicesRes.json(),
        incidentsRes.json()
      ])

      setServices(servicesData)
      setIncidents(incidentsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const activeIncidents = incidents.filter(
    incident => incident.status !== "resolved"
  )

  const maintenanceIncidents = incidents.filter(
    incident => incident.status === "monitoring" && incident.title.toLowerCase().includes('maintenance')
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "outage":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case "investigating":
        return "text-red-500"
      case "identified":
        return "text-orange-500"
      case "monitoring":
        return "text-blue-500"
      case "resolved":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Active Incidents */}
      {activeIncidents.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Active Incidents</AlertTitle>
          <AlertDescription>
            There are currently {activeIncidents.length} active incidents.
          </AlertDescription>
        </Alert>
      )}

      {/* Scheduled Maintenance */}
      {maintenanceIncidents.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Scheduled Maintenance</AlertTitle>
          <AlertDescription>
            There are currently {maintenanceIncidents.length} maintenance activities in progress.
          </AlertDescription>
        </Alert>
      )}

      {/* Services Status */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Services Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {service.name}
                </CardTitle>
                {getStatusIcon(service.status)}
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground capitalize">
                  {service.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Incidents Timeline */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Incident History</h2>
        <div className="space-y-4">
          {incidents
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((incident) => {
              const relatedService = services.find(s => s.id === incident.serviceId)
              return (
                <Card key={incident._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <span className={`text-sm font-medium ${getIncidentStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {relatedService?.name} - {format(new Date(incident.createdAt), 'PPp')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getIncidentStatusColor(incident.status)}`} />
                      <p className="text-sm">
                        {incident.status === "resolved" 
                          ? "This incident has been resolved."
                          : "This incident is still being investigated."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}

