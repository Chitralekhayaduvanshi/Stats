"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/incidents", label: "Incidents" },
  { href: "/admin/teams", label: "Teams" }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div>
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          </div>
        </div>
        </nav>
        <main>{children}</main>
    </div>
  )
} 