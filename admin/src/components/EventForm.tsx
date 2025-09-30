import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { supabase } from '@/lib/supabase'
import { Save, X } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  type: string
  date: string
  time: string
  location: string
  city: string
  organizer: string
  organizer_phone: string
  organizer_email: string
  invitation_message: string
  status: 'pending' | 'approved' | 'rejected'
  admin_feedback?: string
  user_id: string
  created_at: string
  updated_at: string
}

interface EventFormProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

const eventTypes = [
  'Spiritual Discourse',
  'Meditation Session',
  'Kirtan/Bhajan',
  'Festival Celebration',
  'Charity Event',
  'Prayer Meeting',
  'Spiritual Workshop',
  'Pilgrimage',
  'Cultural Program',
  'Other'
]

export default function EventForm({ event, isOpen, onClose, onSave }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    date: '',
    time: '',
    location: '',
    city: '',
    organizer: '',
    organizer_phone: '',
    organizer_email: '',
    invitation_message: '',
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Populate form when editing
  useEffect(() => {
    if (event && isOpen) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        type: event.type || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        city: event.city || '',
        organizer: event.organizer || '',
        organizer_phone: event.organizer_phone || '',
        organizer_email: event.organizer_email || '',
        invitation_message: event.invitation_message || '',
      })
    } else if (!event && isOpen) {
      // Reset form for new event (though this component is mainly for editing)
      setFormData({
        title: '',
        description: '',
        type: '',
        date: '',
        time: '',
        location: '',
        city: '',
        organizer: '',
        organizer_phone: '',
        organizer_email: '',
        invitation_message: '',
      })
    }
  }, [event, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!event) {
      toast({
        title: 'Error',
        description: 'No event selected for editing',
        variant: 'destructive',
      })
      return
    }

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.type.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title, description, and type are required',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
      }

      console.log('Updating event:', event.id, 'with data:', updateData)

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', event.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Event updated successfully',
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('Error updating event:', error)
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-enhanced max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-gradient">Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to the event details before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  className="input-enhanced focus-enhanced"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="input-enhanced focus-enhanced">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Event Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed event description"
                className="min-h-[120px] textarea-enhanced focus-enhanced"
              />
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Date, Time & Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-enhanced focus-enhanced"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Event Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-enhanced focus-enhanced"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Venue/Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter venue or location"
                  className="input-enhanced focus-enhanced"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  className="input-enhanced focus-enhanced"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Organizer Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer Name</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Enter organizer name"
                  className="input-enhanced focus-enhanced"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer_phone">Contact Phone</Label>
                <Input
                  id="organizer_phone"
                  value={formData.organizer_phone}
                  onChange={(e) => setFormData({ ...formData, organizer_phone: e.target.value })}
                  placeholder="Enter contact phone"
                  className="input-enhanced focus-enhanced"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer_email">Contact Email</Label>
              <Input
                id="organizer_email"
                type="email"
                value={formData.organizer_email}
                onChange={(e) => setFormData({ ...formData, organizer_email: e.target.value })}
                placeholder="Enter contact email"
                className="input-enhanced focus-enhanced"
              />
            </div>
          </div>

          {/* Invitation Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Invitation Message</h3>

            <div className="space-y-2">
              <Label htmlFor="invitation_message">Special Message/Invitation</Label>
              <Textarea
                id="invitation_message"
                value={formData.invitation_message}
                onChange={(e) => setFormData({ ...formData, invitation_message: e.target.value })}
                placeholder="Enter any special invitation message or additional details"
                className="min-h-[100px] textarea-enhanced focus-enhanced"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="btn-enhanced hover-lift"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary-enhanced hover-lift"
            >
              {loading ? (
                <div className="loading-spinner-enhanced w-4 h-4 mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}