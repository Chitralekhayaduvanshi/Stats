"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Service {
  id: number
  name: string
  status: "operational" | "degraded" | "outage"
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "API", status: "operational" },
    { id: 2, name: "Website", status: "degraded" },
    { id: 3, name: "Database", status: "operational" },
  ])
  const [newService, setNewService] = useState({ name: "", status: "operational" as const })

  const addService = () => {
    setServices([...services, { id: services.length + 1, ...newService }])
    setNewService({ name: "", status: "operational" })
  }

  const updateService = (id: number, updatedService: Partial<Service>) => {
    setServices(services.map((service) => (service.id === id ? { ...service, ...updatedService } : service)))
  }

  const deleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
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
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                value={newService.status}
                onChange={(e) =>
                  setNewService({ ...newService, status: e.target.value as "operational" | "degraded" | "outage" })
                }
                className="col-span-3"
              >
                <option value="operational">Operational</option>
                <option value="degraded">Degraded</option>
                <option value="outage">Outage</option>
              </select>
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
          {services.map((service) => (
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
                <Button variant="destructive" onClick={() => deleteService(service.id)}>
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

