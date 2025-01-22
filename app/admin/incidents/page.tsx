"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import IncidentForm from "@/components/admin/IncidentForm"
import { Incident, Service } from "@/types"
import { format } from "date-fns"
import { toast } from "sonner"

export default function IncidentsManagement() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  useEffect(() => {
    fetchIncidents()
    fetchServices()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents')
      if (!response.ok) throw new Error('Failed to fetch incidents')
      const data = await response.json()
      setIncidents(data)
    } catch (error) {
      console.error('Error fetching incidents:', error)
      toast.error("Failed to load incidents")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error("Failed to load services")
    }
  }

  const handleCreateIncident = async (incidentData: Partial<Incident>) => {
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidentData),
      })
      
      if (!response.ok) throw new Error('Failed to create incident')
      
      await fetchIncidents()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating incident:', error)
      throw error
    }
  }

  const handleUpdateIncident = async (incidentData: Partial<Incident>) => {
    try {
      const response = await fetch('/api/incidents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedIncident?.id,
          title: incidentData.title,
          status: incidentData.status,
          serviceId: incidentData.serviceId
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update incident')
      }
      
      await fetchIncidents()
      setSelectedIncident(null)
      toast.success("Incident updated successfully")
    } catch (error) {
      console.error('Error updating incident:', error)
      toast.error(error instanceof Error ? error.message : "Failed to update incident")
      throw error
    }
  }

  const handleDeleteIncident = async (id: string) => {
    try {
      const response = await fetch('/api/incidents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      
      if (!response.ok) throw new Error('Failed to delete incident')
      
      await fetchIncidents()
      toast.success("Incident deleted")
    } catch (error) {
      console.error('Error deleting incident:', error)
      toast.error("Failed to delete incident")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Incidents Management</h1>
      
      <Button onClick={() => setShowForm(true)} className="mb-4">
        Add New Incident
      </Button>

      {(showForm || selectedIncident) && (
        <IncidentForm
          incident={selectedIncident}
          services={services}
          onClose={() => {
            setShowForm(false)
            setSelectedIncident(null)
          }}
          onSubmit={selectedIncident ? handleUpdateIncident : handleCreateIncident}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => {
            const relatedService = services.find(s => s.id === incident.serviceId)
            return (
              <TableRow key={incident.id}>
                <TableCell>{incident.title}</TableCell>
                <TableCell>{relatedService?.name ?? 'Unknown'}</TableCell>
                <TableCell>{incident.status}</TableCell>
                <TableCell>{format(new Date(incident.createdAt), 'PPp')}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteIncident(incident.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

