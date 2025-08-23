import { useState, useEffect } from 'react'
import { supabase, TABLES } from '@/lib/supabase'

interface ActivityItem {
  id: string
  type: 'saint' | 'living-saint' | 'divine-form' | 'bhajan' | 'quote' | 'spiritual-fact'
  action: 'added' | 'updated'
  item: string
  time: string
  user: string
  created_at?: string
}

interface TableCounts {
  saints: number
  living_saints: number
  divine_forms: number
  bhajans: number
  quotes: number
  spiritual_facts: number
}

export function useRecentActivity() {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [tableCounts, setTableCounts] = useState<TableCounts>({
    saints: 0,
    living_saints: 0,
    divine_forms: 0,
    bhajans: 0,
    quotes: 0,
    spiritual_facts: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTableCounts = async () => {
    try {
      const tables = [
        { name: 'saints', key: 'saints' as keyof TableCounts },
        { name: 'living_saints', key: 'living_saints' as keyof TableCounts },
        { name: 'divine_forms', key: 'divine_forms' as keyof TableCounts },
        { name: 'bhajans', key: 'bhajans' as keyof TableCounts },
        { name: 'quotes', key: 'quotes' as keyof TableCounts },
        { name: 'spiritual_facts', key: 'spiritual_facts' as keyof TableCounts }
      ]

      const counts: Partial<TableCounts> = {}

      await Promise.all(
        tables.map(async (table) => {
          try {
            const { count, error } = await supabase
              .from(table.name)
              .select('*', { count: 'exact', head: true })

            if (!error && count !== null) {
              counts[table.key] = count
            } else {
              counts[table.key] = 0
            }
          } catch (err) {
            console.warn(`Failed to get count for ${table.name}:`, err)
            counts[table.key] = 0
          }
        })
      )

      setTableCounts(counts as TableCounts)
    } catch (err) {
      console.error('Error fetching table counts:', err)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      setError(null)

      const activities: ActivityItem[] = []

      const tables = [
        { name: 'saints', type: 'saint' as const, nameField: 'name' },
        { name: 'living_saints', type: 'living-saint' as const, nameField: 'name' },
        { name: 'divine_forms', type: 'divine-form' as const, nameField: 'name' },
        { name: 'bhajans', type: 'bhajan' as const, nameField: 'title' },
        { name: 'quotes', type: 'quote' as const, nameField: 'text' },
        { name: 'spiritual_facts', type: 'spiritual-fact' as const, nameField: 'text' }
      ]

      await Promise.all(
        tables.map(async (table) => {
          try {
            const { data, error } = await supabase
              .from(table.name)
              .select(`id, ${table.nameField}, created_at, updated_at`)
              .order('created_at', { ascending: false })
              .limit(3)

            if (!error && data) {
              data.forEach((item: any) => {
                const itemName = item[table.nameField]
                const displayName = table.type === 'quote' || table.type === 'spiritual-fact' 
                  ? (itemName?.length > 50 ? itemName.substring(0, 50) + '...' : itemName)
                  : itemName

                if (displayName) {
                  activities.push({
                    id: `${table.type}-${item.id}`,
                    type: table.type,
                    action: 'added',
                    item: displayName,
                    time: formatTimeAgo(item.created_at),
                    user: 'Admin',
                    created_at: item.created_at
                  })
                }
              })
            }
          } catch (err) {
            console.warn(`Failed to fetch recent ${table.name}:`, err)
          }
        })
      )

      const sortedActivities = activities
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 10)

      setRecentActivity(sortedActivities)
    } catch (err) {
      console.error('Error fetching recent activity:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activity')
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }
  }

  const refetch = () => {
    fetchRecentActivity()
    fetchTableCounts()
  }

  useEffect(() => {
    fetchRecentActivity()
    fetchTableCounts()
  }, [])

  return {
    recentActivity,
    tableCounts,
    loading,
    error,
    refetch
  }
}