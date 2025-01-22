import { NextResponse } from 'next/server'

export async function GET() {
  // Generate mock uptime data
  const uptimeData = Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    uptime: 95 + Math.random() * 5,
  }))
  
  return NextResponse.json(uptimeData)
} 