import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Eye, EyeOff } from 'lucide-react'

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

interface NoticeViewModalProps {
  notice: NoticeItem | null
  isOpen: boolean
  onClose: () => void
}

export default function NoticeViewModal({ notice, isOpen, onClose }: NoticeViewModalProps) {
  if (!notice) return null

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = new Date(notice.expires_at) < new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(notice.type)}</span>
            <div className="flex-1">
              <DialogTitle className="text-xl">{notice.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge className={getTypeColor(notice.type)}>
                  {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                </Badge>
                <Badge variant={notice.is_active ? "default" : "secondary"} className="flex items-center gap-1">
                  {notice.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {notice.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {isExpired && (
                  <Badge variant="destructive">
                    Expired
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Messages */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">English Message</h3>
              <p className="text-gray-700 leading-relaxed">{notice.message}</p>
            </div>

            {notice.message_hi && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Hindi Message</h3>
                <p className="text-gray-700 leading-relaxed">{notice.message_hi}</p>
              </div>
            )}
          </div>

          {/* Notice Preview */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-3">Notice Board Preview</h3>
            <div className="bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg p-3 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getTypeIcon(notice.type)}</span>
                <span className="font-semibold">{notice.title}</span>
              </div>
              <p className="text-sm opacity-90">Tap to see message from saint</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(notice.created_at)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Expires: {formatDate(notice.expires_at)}</span>
            </div>

            {notice.updated_at && (
              <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                <Clock className="w-4 h-4" />
                <span>Last updated: {formatDate(notice.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}