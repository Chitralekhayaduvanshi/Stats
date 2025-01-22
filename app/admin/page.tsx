"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import ServiceForm from "@/components/admin/ServiceForm"
import IncidentForm from "@/components/admin/IncidentForm"
import { Service, Incident } from "@/types"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false)
  const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)

  useEffect(() => {
    fetchServices()
    fetchIncidents()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setIncidents(data)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    }
  }

  const handleServiceSubmit = async (service: Partial<Service>) => {
    await fetch('/api/services', {
      method: editingService ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service)
    })
    fetchServices()
    setIsServiceFormOpen(false)
    setEditingService(null)
  }

  const handleIncidentSubmit = async (incident: Partial<Incident>) => {
    await fetch('/api/incidents', {
      method: editingIncident ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incident)
    })
    fetchIncidents()
    setIsIncidentFormOpen(false)
    setEditingIncident(null)
  }

  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/services`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })
      
      if (!response.ok) throw new Error('Failed to delete service')
      
      await fetchServices()
      toast.success("Service deleted")
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error("Failed to delete service")
    }
  }

  const handleDeleteIncident = async (id: string) => {
    try {
      const response = await fetch(`/api/incidents`, {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Services</h2>
          <Button onClick={() => setIsServiceFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {service.status}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Related Incidents: {incidents.filter(i => i.serviceId === service.id).length}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingService(service)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteService(service.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Incidents</h2>
          <Button onClick={() => setIsIncidentFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Incident
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {incidents.map((incident) => {
            const relatedService = services.find(s => s.id === incident.serviceId)
            return (
              <Card key={incident._id}>
                <CardHeader>
                  <CardTitle>{incident.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Status: {incident.status}</p>
                  <p>Service: {relatedService?.name ?? 'Unknown'}</p>
                  <p>Created: {new Date(incident.createdAt).toLocaleString()}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingIncident(incident)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteIncident(incident._id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {(isServiceFormOpen || editingService) && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setIsServiceFormOpen(false)
            setEditingService(null)
          }}
          onSubmit={handleServiceSubmit}
        />
      )}

      {(isIncidentFormOpen || editingIncident) && (
        <IncidentForm
          incident={editingIncident}
          services={services}
          onClose={() => {
            setIsIncidentFormOpen(false)
            setEditingIncident(null)
          }}
          onSubmit={handleIncidentSubmit}
        />
      )}
    </div>
  )
}

