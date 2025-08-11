import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface Saint {
  id: string
  name: string
  name_hi: string | null
  period: string | null
  region: string | null
  image_url: string | null
  description: string | null
  description_hi: string | null
  specialty: string | null
  specialty_hi: string | null
  biography: string | null
  biography_hi: string | null
  created_at: string
  updated_at: string | null
}

interface SaintFormProps {
  saint?: Saint | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function SaintForm({ saint, isOpen, onClose, onSave }: SaintFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    period: '',
    region: '',
    image_url: '',
    description: '',
    description_hi: '',
    specialty: '',
    specialty_hi: '',
    biography: '',
    biography_hi: '',
  })

  // Update form data when saint prop changes
  useEffect(() => {
    if (saint) {
      setFormData({
        name: saint.name || '',
        name_hi: saint.name_hi || '',
        period: saint.period || '',
        region: saint.region || '',
        image_url: saint.image_url || '',
        description: saint.description || '',
        description_hi: saint.description_hi || '',
        specialty: saint.specialty || '',
        specialty_hi: saint.specialty_hi || '',
        biography: saint.biography || '',
        biography_hi: saint.biography_hi || '',
      })
    } else {
      // Reset form for new saint
      setFormData({
        name: '',
        name_hi: '',
        period: '',
        region: '',
        image_url: '',
        description: '',
        description_hi: '',
        specialty: '',
        specialty_hi: '',
        biography: '',
        biography_hi: '',
      })
    }
  }, [saint, isOpen])

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Saint name is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const dataToSave = {
        name: formData.name.trim(),
        name_hi: formData.name_hi.trim() || '', // Empty string instead of null
        period: formData.period.trim() || '',
        region: formData.region.trim() || '',
        image_url: formData.image_url.trim() || '',
        description: formData.description.trim() || '',
        description_hi: formData.description_hi.trim() || '',
        specialty: formData.specialty.trim() || '',
        specialty_hi: formData.specialty_hi.trim() || '',
        biography: formData.biography.trim() || '',
        biography_hi: formData.biography_hi.trim() || ''
      }

      console.log('💾 Saving saint data:', dataToSave)

      let result
      if (saint?.id) {
        // Update existing saint
        console.log('📝 Updating existing saint with ID:', saint.id)
        result = await supabase
          .from(TABLES.SAINTS)
          .update(dataToSave)
          .eq('id', saint.id)
          .select()
      } else {
        // Create new saint
        console.log('✨ Creating new saint')
        result = await supabase
          .from(TABLES.SAINTS)
          .insert([dataToSave])
          .select()
      }

      console.log('📊 Database result:', result)

      if (result.error) {
        console.error('❌ Database error:', result.error)
        throw result.error
      }

      toast({
        title: "Success",
        description: `Saint ${saint?.id ? 'updated' : 'created'} successfully`
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('❌ Error saving saint:', error)
      
      // More specific error messages
      let errorMessage = `Failed to ${saint?.id ? 'update' : 'create'} saint. Please try again.`
      
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.code === '23502') {
        errorMessage = 'Required database field is missing. Please fill all required fields.'
      }
      
      if (error.code === '23505') {
        errorMessage = 'A saint with this name already exists.'
      }
      
      if (error.code === '42501') {
        errorMessage = 'Permission denied. Please check your database permissions.'
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {saint?.id ? 'Edit Saint' : 'Add New Saint'}
          </DialogTitle>
          <DialogDescription>
            {saint?.id 
              ? 'Update the saint\'s information below.' 
              : 'Fill in the details to add a new saint to the database.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name (English) - Required */}
            <div>
              <Label htmlFor="name" className="text-red-600">Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Sant Tukaram"
                required
              />
            </div>

            {/* Name (Hindi) */}
            <div>
              <Label htmlFor="name_hi">Name (Hindi)</Label>
              <Input
                id="name_hi"
                value={formData.name_hi}
                onChange={(e) => handleInputChange('name_hi', e.target.value)}
                placeholder="e.g., संत तुकाराम"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Period */}
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                placeholder="e.g., 17th Century"
              />
            </div>

            {/* Region */}
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="e.g., Maharashtra"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specialty */}
            <div>
              <Label htmlFor="specialty">Specialty (English)</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                placeholder="e.g., Devotional Poetry"
              />
            </div>

            {/* Specialty Hindi */}
            <div>
              <Label htmlFor="specialty_hi">Specialty (Hindi)</Label>
              <Input
                id="specialty_hi"
                value={formData.specialty_hi}
                onChange={(e) => handleInputChange('specialty_hi', e.target.value)}
                placeholder="e.g., भक्ति काव्य"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/saint-image.jpg"
              type="url"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the saint..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="description_hi">Description (Hindi)</Label>
              <Textarea
                id="description_hi"
                value={formData.description_hi}
                onChange={(e) => handleInputChange('description_hi', e.target.value)}
                placeholder="संत का संक्षिप्त विवरण..."
                rows={4}
              />
            </div>
          </div>

          {/* Biography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="biography">Biography (English)</Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                placeholder="Detailed biography of the saint..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="biography_hi">Biography (Hindi)</Label>
              <Textarea
                id="biography_hi"
                value={formData.biography_hi}
                onChange={(e) => handleInputChange('biography_hi', e.target.value)}
                placeholder="संत की विस्तृत जीवनी..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (saint?.id ? 'Update Saint' : 'Add Saint')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}