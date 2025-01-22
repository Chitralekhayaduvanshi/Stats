'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { Button } from '@/components/ui/button'

export function AuthButton() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.name}</span>
        <Button variant="outline" asChild>
          <a href="/api/auth/logout">Logout</a>
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" asChild>
      <a href="/api/auth/login">Login</a>
    </Button>
  )
} 