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

interface Bhajan {
  id: string
  title: string
  title_hi: string | null
  category: string | null
  lyrics: string | null
  lyrics_hi: string | null
  meaning: string | null
  author: string | null
  youtube_url: string | null
  created_at: string
  updated_at: string | null
}

interface BhajanFormProps {
  bhajan?: Bhajan | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function BhajanForm({ bhajan, isOpen, onClose, onSave }: BhajanFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    title_hi: '',
    category: '',
    lyrics: '',
    lyrics_hi: '',
    meaning: '',
    author: '',
    youtube_url: '',
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update form data when bhajan prop changes
  useEffect(() => {
    if (bhajan) {
      setFormData({
        title: bhajan.title || '',
        title_hi: bhajan.title_hi || '',
        category: bhajan.category || '',
        lyrics: bhajan.lyrics || '',
        lyrics_hi: bhajan.lyrics_hi || '',
        meaning: bhajan.meaning || '',
        author: bhajan.author || '',
        youtube_url: bhajan.youtube_url || '',
      })
    } else {
      // Reset form for new bhajan
      setFormData({
        title: '',
        title_hi: '',
        category: '',
        lyrics: '',
        lyrics_hi: '',
        meaning: '',
        author: '',
        youtube_url: '',
      })
    }
  }, [bhajan, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Bhajan title is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const dataToSave = {
        title: formData.title.trim(),
        title_hi: formData.title_hi.trim() || '',
        category: formData.category.trim() || '',
        lyrics: formData.lyrics.trim() || '',
        lyrics_hi: formData.lyrics_hi.trim() || '',
        meaning: formData.meaning.trim() || '',
        author: formData.author.trim() || '',
        youtube_url: formData.youtube_url.trim() || '',
      }

      console.log('💾 Saving bhajan data:', dataToSave)

      let result
      if (bhajan?.id) {
        // Update existing bhajan
        console.log('📝 Updating existing bhajan with ID:', bhajan.id)
        result = await supabase
          .from(TABLES.BHAJANS)
          .update(dataToSave)
          .eq('id', bhajan.id)
          .select()
      } else {
        // Create new bhajan
        console.log('✨ Creating new bhajan')
        result = await supabase
          .from(TABLES.BHAJANS)
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
        description: `Bhajan ${bhajan?.id ? 'updated' : 'created'} successfully`
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('❌ Error saving bhajan:', error)
      
      // More specific error messages
      let errorMessage = `Failed to ${bhajan?.id ? 'update' : 'create'} bhajan. Please try again.`
      
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.code === '23502') {
        errorMessage = 'Required database field is missing. Please fill all required fields.'
      }
      
      if (error.code === '23505') {
        errorMessage = 'A bhajan with this title already exists.'
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

  // YouTube URL validation helper
  const isValidYouTubeUrl = (url: string) => {
    if (!url) return true // Empty is okay
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}/
    return youtubeRegex.test(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bhajan?.id ? 'Edit Bhajan' : 'Add New Bhajan'}
          </DialogTitle>
          <DialogDescription>
            {bhajan?.id 
              ? 'Update the bhajan\'s information below.' 
              : 'Fill in the details to add a new bhajan to the database.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title (English) - Required */}
              <div>
                <Label htmlFor="title" className="text-green-600">Title (English) *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Hanuman Chalisa"
                  required
                />
              </div>

              {/* Title (Hindi) */}
              <div>
                <Label htmlFor="title_hi">Title (Hindi)</Label>
                <Input
                  id="title_hi"
                  value={formData.title_hi}
                  onChange={(e) => handleInputChange('title_hi', e.target.value)}
                  placeholder="e.g., हनुमान चालीसा"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Devotional, Bhakti, Prayer"
                />
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="e.g., Tulsidas, Traditional"
                />
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input
                id="youtube_url"
                value={formData.youtube_url}
                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
              />
              {formData.youtube_url && !isValidYouTubeUrl(formData.youtube_url) && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid YouTube URL</p>
              )}
              {formData.youtube_url && isValidYouTubeUrl(formData.youtube_url) && (
                <p className="text-sm text-green-600 mt-1">✓ Valid YouTube URL</p>
              )}
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lyrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lyrics">Lyrics (English)</Label>
                <Textarea
                  id="lyrics"
                  value={formData.lyrics}
                  onChange={(e) => handleInputChange('lyrics', e.target.value)}
                  placeholder="Enter the bhajan lyrics in English...

Each line on a new line
Use proper verse formatting"
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Each verse on a new line for better formatting</p>
              </div>

              <div>
                <Label htmlFor="lyrics_hi">Lyrics (Hindi)</Label>
                <Textarea
                  id="lyrics_hi"
                  value={formData.lyrics_hi}
                  onChange={(e) => handleInputChange('lyrics_hi', e.target.value)}
                  placeholder="भजन के बोल हिंदी में...

प्रत्येक पंक्ति नई लाइन पर
उचित छंद प्रारूप का उपयोग करें"
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">सुझाव: बेहतर फॉर्मेटिंग के लिए प्रत्येक छंद को नई लाइन पर लिखें</p>
              </div>
            </div>
          </div>

          {/* Meaning Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Meaning & Context</h3>
            
            <div>
              <Label htmlFor="meaning">Meaning & Significance</Label>
              <Textarea
                id="meaning"
                value={formData.meaning}
                onChange={(e) => handleInputChange('meaning', e.target.value)}
                placeholder="Explain the meaning, significance, and context of this bhajan...

Include:
- Spiritual significance
- Historical context
- Benefits of recitation
- Cultural importance"
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (formData.youtube_url && !isValidYouTubeUrl(formData.youtube_url))} 
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Saving...' : (bhajan?.id ? 'Update Bhajan' : 'Add Bhajan')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}