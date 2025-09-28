import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Calendar,
  Bell
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import NoticeForm from '@/components/NoticeForm'
import NoticeViewModal from '@/components/NoticeViewModal'

interface NoticeItem {
  id: string
  title: string
  message: string
  message_hi: string | null
  type: 'festival' | 'announcement' | 'greeting' | 'update'
  is_active: boolean
  expires_at: string
  created_at: string
  updated_at: string | null
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0
  })

  const { toast } = useToast()

  const fetchNotices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.NOTICES)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setNotices(data || [])

      // Calculate stats
      const now = new Date()
      const total = data?.length || 0
      const active = data?.filter(notice => notice.is_active && new Date(notice.expires_at) > now).length || 0
      const expired = data?.filter(notice => new Date(notice.expires_at) <= now).length || 0

      setStats({ total, active, expired })
    } catch (error) {
      console.error('Error fetching notices:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch notices',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleEdit = (notice: NoticeItem) => {
    setSelectedNotice(notice)
    setIsFormOpen(true)
  }

  const handleView = (notice: NoticeItem) => {
    setSelectedNotice(notice)
    setIsViewModalOpen(true)
  }

  const handleDelete = async (notice: NoticeItem) => {
    if (!confirm('Are you sure you want to delete this notice?')) return

    try {
      const { error } = await supabase
        .from(TABLES.NOTICES)
        .delete()
        .eq('id', notice.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Notice deleted successfully',
      })
      fetchNotices()
    } catch (error) {
      console.error('Error deleting notice:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete notice',
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (notice: NoticeItem) => {
    try {
      const newActiveStatus = !notice.is_active

      // If activating this notice, deactivate all others first
      if (newActiveStatus) {
        await supabase
          .from(TABLES.NOTICES)
          .update({ is_active: false })
          .neq('id', notice.id)
      }

      const { error } = await supabase
        .from(TABLES.NOTICES)
        .update({
          is_active: newActiveStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', notice.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Notice ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
      })
      fetchNotices()
    } catch (error) {
      console.error('Error toggling notice status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update notice status',
        variant: 'destructive',
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedNotice(null)
  }

  const handleViewModalClose = () => {
    setIsViewModalOpen(false)
    setSelectedNotice(null)
  }

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'festival': return '🎉'
      case 'announcement': return '📢'
      case 'greeting': return '🙏'
      case 'update': return '✨'
      default: return '🔔'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'festival': return 'bg-purple-100 text-purple-800'
      case 'announcement': return 'bg-blue-100 text-blue-800'
      case 'greeting': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notice Board Management</h1>
          <p className="text-gray-600 mt-1">
            Manage daily quotes and announcements for the website
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Notice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <Power className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Notices</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Notices</CardTitle>
          <CardDescription>
            Manage your notice board content here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notice</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No notices found matching your search.' : 'No notices created yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getTypeIcon(notice.type)}</span>
                          <div>
                            <div className="font-medium">{notice.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {notice.message}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(notice.type)}>
                          {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <Badge variant={notice.is_active ? "default" : "secondary"}>
                            {notice.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {isExpired(notice.expires_at) && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(notice.expires_at)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(notice.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(notice)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(notice)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(notice)}>
                              {notice.is_active ? (
                                <>
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Power className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(notice)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Forms and Modals */}
      <NoticeForm
        notice={selectedNotice}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={fetchNotices}
      />

      <NoticeViewModal
        notice={selectedNotice}
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
      />
    </div>
  )
}