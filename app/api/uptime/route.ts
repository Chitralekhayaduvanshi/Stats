import { NextResponse } from 'next/server'
import { getUptime, updateUptime } from '@/services/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let uptimeData = await getUptime()
    
    if (uptimeData.length === 0) {
      uptimeData = Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        uptime: 95 + Math.random() * 5,
      }))
      await updateUptime(uptimeData)
    }
    
    return NextResponse.json(uptimeData)
  } catch (error) {
    console.error('Error fetching uptime:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 