"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Service, Incident } from "@/types"
import { toast } from "sonner"

type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved"

interface IncidentFormProps {
  incident?: Incident | null
  services: Service[]
  onClose: () => void
  onSubmit: (incident: Partial<Incident>) => Promise<void>
}

export default function IncidentForm({ incident, services, onClose, onSubmit }: IncidentFormProps) {
  const [title, setTitle] = useState(incident?.title ?? "")
  const [status, setStatus] = useState<IncidentStatus>(incident?.status ?? "investigating")
  const [serviceId, setServiceId] = useState(incident?.serviceId ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!serviceId) {
      toast.error("Please select a service")
      return
    }
    try {
      setIsSubmitting(true)
      await onSubmit({
        _id: incident?._id,
        title,
        status,
        serviceId,
        createdAt: incident?.createdAt ?? new Date(),
        updatedAt: new Date()
      })
      toast.success(incident ? "Incident updated" : "Incident created")
      onClose()
    } catch (error) {
      console.error('Error submitting incident:', error)
      toast.error("Failed to save incident")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (incident) {
      setTitle(incident.title)
      setStatus(incident.status)
      setServiceId(incident.serviceId)
    }
  }, [incident])

  const handleStatusChange = (value: IncidentStatus) => {
    setStatus(value)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{incident ? 'Edit Incident' : 'Add Incident'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter incident title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            <Select
              value={serviceId}
              onValueChange={setServiceId}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status}
              onValueChange={(value: IncidentStatus) => setStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="identified">Identified</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : incident ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 