import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'

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

interface NoticeFormProps {
  notice?: NoticeItem | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function NoticeForm({ notice, isOpen, onClose, onSave }: NoticeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    message_hi: '',
    type: 'announcement' as 'festival' | 'announcement' | 'greeting' | 'update',
    is_active: true,
    expires_at: '',
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Set default expiry date to 7 days from now
  useEffect(() => {
    if (isOpen && !notice) {
      const defaultExpiry = new Date()
      defaultExpiry.setDate(defaultExpiry.getDate() + 7)
      setFormData(prev => ({
        ...prev,
        expires_at: defaultExpiry.toISOString().split('T')[0]
      }))
    }
  }, [isOpen, notice])

  // Populate form when editing
  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title,
        message: notice.message,
        message_hi: notice.message_hi || '',
        type: notice.type,
        is_active: notice.is_active,
        expires_at: notice.expires_at.split('T')[0], // Format for date input
      })
    } else if (isOpen) {
      // Reset form for new notice
      const defaultExpiry = new Date()
      defaultExpiry.setDate(defaultExpiry.getDate() + 7)
      setFormData({
        title: '',
        message: '',
        message_hi: '',
        type: 'announcement',
        is_active: true,
        expires_at: defaultExpiry.toISOString().split('T')[0],
      })
    }
  }, [notice, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and message are required',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        expires_at: new Date(formData.expires_at + 'T23:59:59').toISOString(),
        message_hi: formData.message_hi.trim() || null,
      }

      if (notice) {
        // Update existing notice
        const { error } = await supabase
          .from(TABLES.NOTICES)
          .update(submitData)
          .eq('id', notice.id)

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Notice updated successfully',
        })
      } else {
        // Create new notice
        const { error } = await supabase
          .from(TABLES.NOTICES)
          .insert(submitData)

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Notice created successfully',
        })
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving notice:', error)
      toast({
        title: 'Error',
        description: 'Failed to save notice. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-enhanced max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle>{notice ? 'Edit Notice' : 'Create New Notice'}</DialogTitle>
          <DialogDescription>
            {notice ? 'Update the notice details below.' : 'Create a new notice for the website notice board.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Navratri Wishes 🌸"
                className="w-full input-enhanced focus-enhanced"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="festival">Festival 🎉</SelectItem>
                  <SelectItem value="announcement">Announcement 📢</SelectItem>
                  <SelectItem value="greeting">Greeting 🙏</SelectItem>
                  <SelectItem value="update">Update ✨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (English) *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter the notice message in English..."
              className="min-h-[100px] textarea-enhanced focus-enhanced"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message_hi">Message (Hindi)</Label>
            <Textarea
              id="message_hi"
              value={formData.message_hi}
              onChange={(e) => setFormData({ ...formData, message_hi: e.target.value })}
              placeholder="वैकल्पिक हिंदी संदेश दर्ज करें..."
              className="min-h-[100px] textarea-enhanced focus-enhanced"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expires On</Label>
              <Input
                id="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                className="w-full input-enhanced focus-enhanced"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4 sm:pt-6">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active Notice
              </Label>
            </div>
          </div>

          {formData.is_active && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> Setting this notice as active will deactivate all other notices.
                Only one notice can be active at a time.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : notice ? 'Update Notice' : 'Create Notice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}