"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Users } from "lucide-react"
import { Team, User } from "@/types"
import { toast } from "sonner"
import TeamForm from "@/components/admin/TeamForm"

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

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
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const teamMembers = users.filter(user => user.teamId === team._id)
          return (
            <Card key={team._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {team.name}
                  <span className="text-sm text-muted-foreground">
                    <Users className="inline-block mr-1 h-4 w-4" />
                    {teamMembers.length} members
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {team.description || 'No description'}
                </p>
                {teamMembers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Members:</h4>
                    <ul className="text-sm space-y-1">
                      {teamMembers.map(member => (
                        <li key={member._id}>{member.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTeam(team)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(team._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
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