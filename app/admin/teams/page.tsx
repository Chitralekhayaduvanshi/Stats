"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Users, Search, Settings2 } from "lucide-react"
import { Team, User } from "@/types"
import { toast } from "sonner"
import TeamForm from "@/components/admin/TeamForm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/users')
      ])
      
      const [teamsData, usersData] = await Promise.all([
        teamsRes.json(),
        usersRes.json()
      ])

      setTeams(teamsData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (teamData: Partial<Team>) => {
    try {
      const response = await fetch('/api/teams', {
        method: selectedTeam ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          selectedTeam 
            ? { ...teamData, _id: selectedTeam._id }
            : teamData
        ),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save team')
      }

      await fetchData()
      setShowForm(false)
      setSelectedTeam(null)
      toast.success(selectedTeam ? "Team updated" : "Team created")
    } catch (error) {
      console.error('Error saving team:', error)
      toast.error(error instanceof Error ? error.message : "Failed to save team")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error('Failed to delete team')

      await fetchData()
      toast.success("Team deleted")
    } catch (error) {
      console.error('Error deleting team:', error)
      toast.error("Failed to delete team")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Teams Management</h1>
          <p className="text-muted-foreground">Manage your organization's teams and members</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Team
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => {
          const teamMembers = users.filter(user => user.teamId === team._id)
          return (
            <Card key={team._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{team.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      <Users className="inline-block mr-1 h-3 w-3" />
                      {teamMembers.length}
                    </Badge>
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedTeam(team)}>
                        Edit team
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(team._id)}
                      >
                        Delete team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {team.description || 'No description'}
                </p>
                {teamMembers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Members:</h4>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers.map(member => (
                        <Badge key={member._id} variant="outline">
                          {member.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {(showForm || selectedTeam) && (
        <TeamForm
          team={selectedTeam}
          onClose={() => {
            setShowForm(false)
            setSelectedTeam(null)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
} 