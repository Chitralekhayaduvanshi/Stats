"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Service } from "@/types"
import { toast } from "sonner"

type ServiceStatus = "operational" | "degraded" | "outage"

interface ServiceFormProps {
  service?: Service | null
  onClose: () => void
  onSubmit: (service: Partial<Service>) => Promise<void>
}

export default function ServiceForm({ service, onClose, onSubmit }: ServiceFormProps) {
  const [name, setName] = useState(service?.name ?? "")
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? "operational")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await onSubmit({
        name,
        status
      })
      toast.success(service ? "Service updated" : "Service created")
      onClose()
    } catch (error) {
      console.error('Error submitting service:', error)
      toast.error("Failed to save service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = (value: ServiceStatus) => {
    setStatus(value)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="degraded">Degraded</SelectItem>
                <SelectItem value="outage">Outage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : service ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 