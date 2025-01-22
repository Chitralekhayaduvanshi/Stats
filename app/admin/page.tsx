import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>Manage your services</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/services">
              <Button>Manage Services</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incidents</CardTitle>
            <CardDescription>Manage incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/incidents">
              <Button>Manage Incidents</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

