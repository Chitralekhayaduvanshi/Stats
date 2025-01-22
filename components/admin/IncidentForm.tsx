"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Incident } from "@/types"
import { toast } from "sonner"

type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved"

interface IncidentFormProps {
  incident?: Incident | null
  onClose: () => void
  onSubmit: (incident: Partial<Incident>) => Promise<void>
}

export default function IncidentForm({ incident, onClose, onSubmit }: IncidentFormProps) {
  const [title, setTitle] = useState(incident?.title ?? "")
  const [status, setStatus] = useState<IncidentStatus>(incident?.status ?? "investigating")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await onSubmit({
        id: incident?.id,
        title,
        status,
        createdAt: incident?.createdAt ?? new Date()
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
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
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