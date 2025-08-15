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

interface DivineForm {
  id: string
  name: string
  name_hi: string | null
  domain: string | null
  domain_hi: string | null
  image_url: string | null
  description: string | null
  description_hi: string | null
  attributes: string[] | null
  mantra: string | null
  significance: string | null
  created_at: string
  updated_at: string | null
}

interface DivineFormFormProps {
  divineForm?: DivineForm | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function DivineFormForm({ divineForm, isOpen, onClose, onSave }: DivineFormFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    domain: '',
    domain_hi: '',
    image_url: '',
    description: '',
    description_hi: '',
    attributes: '',
    mantra: '',
    significance: '',
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update form data when divineForm prop changes
  useEffect(() => {
    if (divineForm) {
      setFormData({
        name: divineForm.name || '',
        name_hi: divineForm.name_hi || '',
        domain: divineForm.domain || '',
        domain_hi: divineForm.domain_hi || '',
        image_url: divineForm.image_url || '',
        description: divineForm.description || '',
        description_hi: divineForm.description_hi || '',
        attributes: divineForm.attributes ? divineForm.attributes.join(', ') : '',
        mantra: divineForm.mantra || '',
        significance: divineForm.significance || '',
      })
    } else {
      // Reset form for new divine form
      setFormData({
        name: '',
        name_hi: '',
        domain: '',
        domain_hi: '',
        image_url: '',
        description: '',
        description_hi: '',
        attributes: '',
        mantra: '',
        significance: '',
      })
    }
  }, [divineForm, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Divine form name is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      // Process arrays from comma-separated strings
      const attributesArray = formData.attributes ? 
        formData.attributes.split(',').map(a => a.trim()).filter(a => a) : []

      const dataToSave = {
        name: formData.name.trim(),
        name_hi: formData.name_hi.trim() || null,
        domain: formData.domain.trim() || null,
        domain_hi: formData.domain_hi.trim() || null,
        image_url: formData.image_url.trim() || null,
        description: formData.description.trim() || null,
        description_hi: formData.description_hi.trim() || null,
        attributes: attributesArray.length > 0 ? attributesArray : null,
        mantra: formData.mantra.trim() || null,
        significance: formData.significance.trim() || null,
      }

      console.log('💾 Saving divine form data:', dataToSave)

      let result
      if (divineForm?.id) {
        // Update existing divine form
        console.log('📝 Updating existing divine form with ID:', divineForm.id)
        result = await supabase
          .from(TABLES.DIVINE_FORMS)
          .update(dataToSave)
          .eq('id', divineForm.id)
          .select()
      } else {
        // Create new divine form
        console.log('✨ Creating new divine form')
        result = await supabase
          .from(TABLES.DIVINE_FORMS)
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
        description: `Divine form ${divineForm?.id ? 'updated' : 'created'} successfully`
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('❌ Error saving divine form:', error)
      
      // More specific error messages
      let errorMessage = `Failed to ${divineForm?.id ? 'update' : 'create'} divine form. Please try again.`
      
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.code === '23502') {
        errorMessage = 'Required database field is missing. Please fill all required fields.'
      }
      
      if (error.code === '23505') {
        errorMessage = 'A divine form with this name already exists.'
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {divineForm?.id ? 'Edit Divine Form' : 'Add New Divine Form'}
          </DialogTitle>
          <DialogDescription>
            {divineForm?.id 
              ? 'Update the divine form\'s information below.' 
              : 'Fill in the details to add a new divine form to the database.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name (English) - Required */}
              <div>
                <Label htmlFor="name" className="text-purple-600">Name (English) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Lord Ganesha"
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
                  placeholder="e.g., भगवान गणेश"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Domain */}
              <div>
                <Label htmlFor="domain">Domain (English)</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  placeholder="e.g., Remover of Obstacles"
                />
              </div>

              {/* Domain Hindi */}
              <div>
                <Label htmlFor="domain_hi">Domain (Hindi)</Label>
                <Input
                  id="domain_hi"
                  value={formData.domain_hi}
                  onChange={(e) => handleInputChange('domain_hi', e.target.value)}
                  placeholder="e.g., विघ्न हर्ता"
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
                placeholder="https://example.com/divine-form-image.jpg"
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
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Description</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the divine form..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="description_hi">Description (Hindi)</Label>
                <Textarea
                  id="description_hi"
                  value={formData.description_hi}
                  onChange={(e) => handleInputChange('description_hi', e.target.value)}
                  placeholder="दिव्य रूप का संक्षिप्त विवरण..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Sacred Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Sacred Information</h3>
            
            <div>
              <Label htmlFor="mantra">Sacred Mantra</Label>
              <Input
                id="mantra"
                value={formData.mantra}
                onChange={(e) => handleInputChange('mantra', e.target.value)}
                placeholder="e.g., ॐ गं गणपतये नमः"
              />
            </div>

            <div>
              <Label htmlFor="significance">Significance</Label>
              <Textarea
                id="significance"
                value={formData.significance}
                onChange={(e) => handleInputChange('significance', e.target.value)}
                placeholder="Spiritual significance and importance..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="attributes">Attributes (comma-separated)</Label>
              <Input
                id="attributes"
                value={formData.attributes}
                onChange={(e) => handleInputChange('attributes', e.target.value)}
                placeholder="e.g., Elephant head, Four arms, Modaka, Wisdom"
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? 'Saving...' : (divineForm?.id ? 'Update Divine Form' : 'Add Divine Form')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}