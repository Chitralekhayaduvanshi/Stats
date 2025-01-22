import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Nav() {
  return (
    <nav className="bg-secondary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Button variant="link" className="text-xl font-bold">
            Status App
          </Button>
        </Link>
        <div>
          <Link href="/admin">
            <Button variant="outline" className="mr-2">
              Admin
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Public Status</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

