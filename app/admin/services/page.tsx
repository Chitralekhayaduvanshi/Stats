"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ServiceForm from "@/components/admin/ServiceForm"
import { Service } from "@/types"
import { toast } from "sonner"

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error("Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateService = async (serviceData: Partial<Service>) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      })
      
      if (!response.ok) throw new Error('Failed to create service')
      
      await fetchServices()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  }

  const handleUpdateService = async (serviceData: Partial<Service>) => {
    try {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...serviceData, id: selectedService?.id }),
      })
      
      if (!response.ok) throw new Error('Failed to update service')
      
      await fetchServices()
      setSelectedService(null)
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      
      if (!response.ok) throw new Error('Failed to delete service')
      
      await fetchServices()
      toast.success("Service deleted")
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error("Failed to delete service")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Services Management</h1>
      
      <Button onClick={() => setShowForm(true)} className="mb-4">
        Add New Service
      </Button>

      {(showForm || selectedService) && (
        <ServiceForm
          service={selectedService}
          onClose={() => {
            setShowForm(false)
            setSelectedService(null)
          }}
          onSubmit={selectedService ? handleUpdateService : handleCreateService}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setSelectedService(service)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

