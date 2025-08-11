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

interface LivingSaint {
  id: string
  name: string
  name_hi: string | null
  organization: string | null
  specialty: string | null
  specialty_hi: string | null
  image: string | null
  description: string | null
  description_hi: string | null
  website: string | null
  followers: string | null
  teachings: string[] | null
  birth_place: string | null
  birth_place_hi: string | null
  current_location: string | null
  current_location_hi: string | null
  biography: string | null
  biography_hi: string | null
  spiritual_journey: string | null
  spiritual_journey_hi: string | null
  key_teachings: string[] | null
  key_teachings_hi: string[] | null
  quotes: string[] | null
  quotes_hi: string[] | null
  ashram: string | null
  ashram_hi: string | null
  lineage: string | null
  lineage_hi: string | null
  created_at: string
  updated_at: string | null
}

interface LivingSaintFormProps {
  saint?: LivingSaint | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function LivingSaintForm({ saint, isOpen, onClose, onSave }: LivingSaintFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    organization: '',
    specialty: '',
    specialty_hi: '',
    image: '',
    description: '',
    description_hi: '',
    website: '',
    followers: '',
    teachings: '',
    birth_place: '',
    birth_place_hi: '',
    current_location: '',
    current_location_hi: '',
    biography: '',
    biography_hi: '',
    spiritual_journey: '',
    spiritual_journey_hi: '',
    key_teachings: '',
    key_teachings_hi: '',
    quotes: '',
    quotes_hi: '',
    ashram: '',
    ashram_hi: '',
    lineage: '',
    lineage_hi: '',
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update form data when saint prop changes
  useEffect(() => {
    if (saint) {
      setFormData({
        name: saint.name || '',
        name_hi: saint.name_hi || '',
        organization: saint.organization || '',
        specialty: saint.specialty || '',
        specialty_hi: saint.specialty_hi || '',
        image: saint.image || '',
        description: saint.description || '',
        description_hi: saint.description_hi || '',
        website: saint.website || '',
        followers: saint.followers || '',
        teachings: saint.teachings ? saint.teachings.join(', ') : '',
        birth_place: saint.birth_place || '',
        birth_place_hi: saint.birth_place_hi || '',
        current_location: saint.current_location || '',
        current_location_hi: saint.current_location_hi || '',
        biography: saint.biography || '',
        biography_hi: saint.biography_hi || '',
        spiritual_journey: saint.spiritual_journey || '',
        spiritual_journey_hi: saint.spiritual_journey_hi || '',
        key_teachings: saint.key_teachings ? saint.key_teachings.join(', ') : '',
        key_teachings_hi: saint.key_teachings_hi ? saint.key_teachings_hi.join(', ') : '',
        quotes: saint.quotes ? saint.quotes.join('\n') : '',
        quotes_hi: saint.quotes_hi ? saint.quotes_hi.join('\n') : '',
        ashram: saint.ashram || '',
        ashram_hi: saint.ashram_hi || '',
        lineage: saint.lineage || '',
        lineage_hi: saint.lineage_hi || '',
      })
    } else {
      // Reset form for new saint
      setFormData({
        name: '',
        name_hi: '',
        organization: '',
        specialty: '',
        specialty_hi: '',
        image: '',
        description: '',
        description_hi: '',
        website: '',
        followers: '',
        teachings: '',
        birth_place: '',
        birth_place_hi: '',
        current_location: '',
        current_location_hi: '',
        biography: '',
        biography_hi: '',
        spiritual_journey: '',
        spiritual_journey_hi: '',
        key_teachings: '',
        key_teachings_hi: '',
        quotes: '',
        quotes_hi: '',
        ashram: '',
        ashram_hi: '',
        lineage: '',
        lineage_hi: '',
      })
    }
  }, [saint, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Living saint name is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      // Process arrays from comma-separated strings
      const teachingsArray = formData.teachings ? 
        formData.teachings.split(',').map(t => t.trim()).filter(t => t) : []
      const keyTeachingsArray = formData.key_teachings ? 
        formData.key_teachings.split(',').map(t => t.trim()).filter(t => t) : []
      const keyTeachingsHiArray = formData.key_teachings_hi ? 
        formData.key_teachings_hi.split(',').map(t => t.trim()).filter(t => t) : []
      const quotesArray = formData.quotes ? 
        formData.quotes.split('\n').map(q => q.trim()).filter(q => q) : []
      const quotesHiArray = formData.quotes_hi ? 
        formData.quotes_hi.split('\n').map(q => q.trim()).filter(q => q) : []

      const dataToSave = {
        name: formData.name.trim(),
        name_hi: formData.name_hi.trim() || '',
        organization: formData.organization.trim() || '',
        specialty: formData.specialty.trim() || '',
        specialty_hi: formData.specialty_hi.trim() || '',
        image: formData.image.trim() || '',
        description: formData.description.trim() || '',
        description_hi: formData.description_hi.trim() || '',
        website: formData.website.trim() || '',
        followers: formData.followers.trim() || '',
        teachings: teachingsArray.length > 0 ? teachingsArray : null,
        birth_place: formData.birth_place.trim() || '',
        birth_place_hi: formData.birth_place_hi.trim() || '',
        current_location: formData.current_location.trim() || '',
        current_location_hi: formData.current_location_hi.trim() || '',
        biography: formData.biography.trim() || '',
        biography_hi: formData.biography_hi.trim() || '',
        spiritual_journey: formData.spiritual_journey.trim() || '',
        spiritual_journey_hi: formData.spiritual_journey_hi.trim() || '',
        key_teachings: keyTeachingsArray.length > 0 ? keyTeachingsArray : null,
        key_teachings_hi: keyTeachingsHiArray.length > 0 ? keyTeachingsHiArray : null,
        quotes: quotesArray.length > 0 ? quotesArray : null,
        quotes_hi: quotesHiArray.length > 0 ? quotesHiArray : null,
        ashram: formData.ashram.trim() || '',
        ashram_hi: formData.ashram_hi.trim() || '',
        lineage: formData.lineage.trim() || '',
        lineage_hi: formData.lineage_hi.trim() || ''
      }

      console.log('💾 Saving living saint data:', dataToSave)

      let result
      if (saint?.id) {
        // Update existing saint
        console.log('📝 Updating existing living saint with ID:', saint.id)
        result = await supabase
          .from(TABLES.LIVING_SAINTS)
          .update(dataToSave)
          .eq('id', saint.id)
          .select()
      } else {
        // Create new saint
        console.log('✨ Creating new living saint')
        result = await supabase
          .from(TABLES.LIVING_SAINTS)
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
        description: `Living saint ${saint?.id ? 'updated' : 'created'} successfully`
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('❌ Error saving living saint:', error)
      
      // More specific error messages
      let errorMessage = `Failed to ${saint?.id ? 'update' : 'create'} living saint. Please try again.`
      
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.code === '23502') {
        errorMessage = 'Required database field is missing. Please fill all required fields.'
      }
      
      if (error.code === '23505') {
        errorMessage = 'A living saint with this name already exists.'
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {saint?.id ? 'Edit Living Saint' : 'Add New Living Saint'}
          </DialogTitle>
          <DialogDescription>
            {saint?.id 
              ? 'Update the living saint\'s information below.' 
              : 'Fill in the details to add a new living saint to the database.'
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
                <Label htmlFor="name" className="text-red-600">Name (English) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Sadhguru Jaggi Vasudev"
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
                  placeholder="e.g., सद्गुरु जग्गी वासुदेव"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization */}
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  placeholder="e.g., Isha Foundation"
                />
              </div>

              {/* Followers */}
              <div>
                <Label htmlFor="followers">Followers Count</Label>
                <Input
                  id="followers"
                  value={formData.followers}
                  onChange={(e) => handleInputChange('followers', e.target.value)}
                  placeholder="e.g., 10 Million"
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
                  placeholder="e.g., Yoga & Meditation"
                />
              </div>

              {/* Specialty Hindi */}
              <div>
                <Label htmlFor="specialty_hi">Specialty (Hindi)</Label>
                <Input
                  id="specialty_hi"
                  value={formData.specialty_hi}
                  onChange={(e) => handleInputChange('specialty_hi', e.target.value)}
                  placeholder="e.g., योग और ध्यान"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/saint-image.jpg"
                type="url"
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth_place">Birth Place (English)</Label>
                <Input
                  id="birth_place"
                  value={formData.birth_place}
                  onChange={(e) => handleInputChange('birth_place', e.target.value)}
                  placeholder="e.g., Mysore, Karnataka"
                />
              </div>

              <div>
                <Label htmlFor="birth_place_hi">Birth Place (Hindi)</Label>
                <Input
                  id="birth_place_hi"
                  value={formData.birth_place_hi}
                  onChange={(e) => handleInputChange('birth_place_hi', e.target.value)}
                  placeholder="e.g., मैसूर, कर्नाटक"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_location">Current Location (English)</Label>
                <Input
                  id="current_location"
                  value={formData.current_location}
                  onChange={(e) => handleInputChange('current_location', e.target.value)}
                  placeholder="e.g., Coimbatore, Tamil Nadu"
                />
              </div>

              <div>
                <Label htmlFor="current_location_hi">Current Location (Hindi)</Label>
                <Input
                  id="current_location_hi"
                  value={formData.current_location_hi}
                  onChange={(e) => handleInputChange('current_location_hi', e.target.value)}
                  placeholder="e.g., कोयंबतूर, तमिल नाडु"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ashram">Ashram (English)</Label>
                <Input
                  id="ashram"
                  value={formData.ashram}
                  onChange={(e) => handleInputChange('ashram', e.target.value)}
                  placeholder="e.g., Isha Yoga Center"
                />
              </div>

              <div>
                <Label htmlFor="ashram_hi">Ashram (Hindi)</Label>
                <Input
                  id="ashram_hi"
                  value={formData.ashram_hi}
                  onChange={(e) => handleInputChange('ashram_hi', e.target.value)}
                  placeholder="e.g., ईशा योग केंद्र"
                />
              </div>
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
                  placeholder="Brief description of the living saint..."
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
          </div>

          {/* Teachings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Teachings & Philosophy</h3>
            
            <div>
              <Label htmlFor="teachings">Core Teachings (comma-separated)</Label>
              <Input
                id="teachings"
                value={formData.teachings}
                onChange={(e) => handleInputChange('teachings', e.target.value)}
                placeholder="e.g., Yoga, Meditation, Mindfulness, Inner Engineering"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="key_teachings">Key Teachings (English, comma-separated)</Label>
                <Textarea
                  id="key_teachings"
                  value={formData.key_teachings}
                  onChange={(e) => handleInputChange('key_teachings', e.target.value)}
                  placeholder="e.g., Inner transformation, Consciousness, Self-realization"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="key_teachings_hi">Key Teachings (Hindi, comma-separated)</Label>
                <Textarea
                  id="key_teachings_hi"
                  value={formData.key_teachings_hi}
                  onChange={(e) => handleInputChange('key_teachings_hi', e.target.value)}
                  placeholder="e.g., आंतरिक परिवर्तन, चेतना, आत्म-साक्षात्कार"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lineage">Spiritual Lineage</Label>
              <Input
                id="lineage"
                value={formData.lineage}
                onChange={(e) => handleInputChange('lineage', e.target.value)}
                placeholder="e.g., Adiyogi tradition"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? 'Saving...' : (saint?.id ? 'Update Living Saint' : 'Add Living Saint')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}