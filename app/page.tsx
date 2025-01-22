"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Service, Incident } from "@/types"

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [uptimeData, setUptimeData] = useState<{ name: string; uptime: number }[]>([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      // Fetch services
      const servicesResponse = await fetch('/api/services')
      const servicesData = await servicesResponse.json()
      setServices(servicesData)

      // Fetch incidents
      const incidentsResponse = await fetch('/api/incidents')
      const incidentsData = await incidentsResponse.json()
      setIncidents(incidentsData)

      // Fetch uptime data
      const uptimeResponse = await fetch('/api/uptime')
      const uptimeData = await uptimeResponse.json()
      setUptimeData(uptimeData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getStatusIcon = (status: Service["status"]) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="text-green-500" />
      case "degraded":
        return <AlertTriangle className="text-yellow-500" />
      case "outage":
        return <XCircle className="text-red-500" />
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">System Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getStatusIcon(service.status)}
                <span className="ml-2">{service.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{service.status}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4">Current Incidents</h2>
      {incidents.length > 0 ? (
        incidents.map((incident) => (
          <Alert key={incident.id} className="mb-4">
            <AlertTitle>{incident.title}</AlertTitle>
            <AlertDescription>
              Status: {incident.status}
              <br />
              Created: {incident.createdAt.toLocaleString()}
            </AlertDescription>
          </Alert>
        ))
      ) : (
        <p>No current incidents</p>
      )}
      <h2 className="text-2xl font-bold my-4">Uptime Chart</h2>
      <Card>
        <CardHeader>
          <CardTitle>30-Day Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uptimeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uptime" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

