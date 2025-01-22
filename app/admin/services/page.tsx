"use client"

import { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Service } from '@/types'

type ServiceStatus = "operational" | "degraded" | "outage"

interface ServiceFormData {
  name: string
  status: ServiceStatus
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "API", status: "operational" },
    { id: "2", name: "Website", status: "degraded" },
    { id: "3", name: "Database", status: "operational" },
  ])

  const [newService, setNewService] = useState<ServiceFormData>({
    name: "",
    status: "operational"
  })

  const addService = () => {
    setServices([
      ...services,
      { id: Date.now().toString(), ...newService }
    ])
    setNewService({ name: "", status: "operational" })
  }

  const updateService = (id: string, updatedService: Partial<Service>) => {
    setServices(services.map((service: Service) => 
      service.id === id ? { ...service, ...updatedService } : service
    ))
  }

  const deleteService = (id: string) => {
    setServices(services.filter((service: Service) => service.id !== id))
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewService({ ...newService, name: e.target.value })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Services Management</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Service</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newService.name}
                onChange={handleNameChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newService.status}
                onValueChange={(value: ServiceStatus) =>
                  setNewService({ ...newService, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                  <SelectItem value="outage">Outage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addService}>Add Service</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: Service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateService(service.id, { status: "operational" })}
                >
                  Set Operational
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateService(service.id, { status: "degraded" })}
                >
                  Set Degraded
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateService(service.id, { status: "outage" })}
                >
                  Set Outage
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteService(service.id)}
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

