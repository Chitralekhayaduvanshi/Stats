"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Incident {
  id: number
  title: string
  description: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: Date
}

export default function IncidentManagement() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 1,
      title: "API Slowdown",
      description: "We're experiencing slowdowns in our API",
      status: "investigating",
      createdAt: new Date(),
    },
  ])
  const [newIncident, setNewIncident] = useState({ title: "", description: "", status: "investigating" as const })

  const addIncident = () => {
    setIncidents([...incidents, { id: incidents.length + 1, ...newIncident, createdAt: new Date() }])
    setNewIncident({ title: "", description: "", status: "investigating" })
  }

  const updateIncidentStatus = (id: number, status: Incident["status"]) => {
    setIncidents(incidents.map((incident) => (incident.id === id ? { ...incident, status } : incident)))
  }

  const deleteIncident = (id: number) => {
    setIncidents(incidents.filter((incident) => incident.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Incident Management</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Create New Incident</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Incident</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={addIncident}>Create Incident</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>{incident.title}</TableCell>
              <TableCell>{incident.description}</TableCell>
              <TableCell>{incident.status}</TableCell>
              <TableCell>{incident.createdAt.toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateIncidentStatus(incident.id, "investigating")}
                >
                  Investigating
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateIncidentStatus(incident.id, "identified")}
                >
                  Identified
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateIncidentStatus(incident.id, "monitoring")}
                >
                  Monitoring
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateIncidentStatus(incident.id, "resolved")}
                >
                  Resolved
                </Button>
                <Button variant="destructive" onClick={() => deleteIncident(incident.id)}>
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

