"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ServiceForm from "@/components/admin/ServiceForm"
import IncidentForm from "@/components/admin/IncidentForm"
import { Service, Incident } from "@/types"

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/services"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">Services</h3>
          <p className="text-gray-600">Manage your services</p>
        </Link>
        <Link
          href="/admin/incidents"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">Incidents</h3>
          <p className="text-gray-600">Manage incidents</p>
        </Link>
      </div>
    </div>
  )
}

