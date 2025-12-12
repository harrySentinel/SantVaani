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

interface QuoteItem {
  id: string
  text: string
  text_hi: string | null
  author: string | null
  category: string | null
  source: string | null
  context: string | null
  tags: string[] | null
  created_at: string
  updated_at: string | null
}

interface QuoteFormProps {
  quote?: QuoteItem | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function QuoteForm({ quote, isOpen, onClose, onSave }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    text: '',
    text_hi: '',
    author: '',
    category: '',
    source: '',
    context: '',
    tags: '',
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update form data when quote prop changes
  useEffect(() => {
    if (quote) {
      setFormData({
        text: quote.text || '',
        text_hi: quote.text_hi || '',
        author: quote.author || '',
        category: quote.category || '',
        source: quote.source || '',
        context: quote.context || '',
        tags: quote.tags ? quote.tags.join(', ') : '',
      })
    } else {
      // Reset form for new quote
      setFormData({
        text: '',
        text_hi: '',
        author: '',
        category: '',
        source: '',
        context: '',
        tags: '',
      })
    }
  }, [quote, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.text.trim()) {
      toast({
        title: "Validation Error",
        description: "Quote text is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      // Process tags from comma-separated string
      const tagsArray = formData.tags ? 
        formData.tags.split(',').map(t => t.trim()).filter(t => t) : []

      const dataToSave = {
        text: formData.text.trim(),
        text_hi: formData.text_hi.trim() || '',
        author: formData.author.trim() || '',
        category: formData.category.trim() || '',
        tags: tagsArray.length > 0 ? tagsArray : null,
      }

      console.log('💾 Saving quote data:', dataToSave)

      let result
      if (quote?.id) {
        // Update existing quote
        console.log('📝 Updating existing quote with ID:', quote.id)
        result = await supabase
          .from(TABLES.QUOTES)
          .update(dataToSave)
          .eq('id', quote.id)
          .select()
      } else {
        // Create new quote
        console.log('✨ Creating new quote')
        result = await supabase
          .from(TABLES.QUOTES)
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
        description: `Quote ${quote?.id ? 'updated' : 'created'} successfully`
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('❌ Error saving quote:', error)
      
      // More specific error messages
      let errorMessage = `Failed to ${quote?.id ? 'update' : 'create'} quote. Please try again.`
      
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.code === '23502') {
        errorMessage = 'Required database field is missing. Please fill all required fields.'
      }
      
      if (error.code === '23505') {
        errorMessage = 'A quote with this text already exists.'
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

  // Character count for quote text
  const getCharacterCount = (text: string) => text.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quote?.id ? 'Edit Quote' : 'Add New Quote'}
          </DialogTitle>
          <DialogDescription>
            {quote?.id 
              ? 'Update the quote\'s information below.' 
              : 'Fill in the details to add a new quote to the database.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quote Text Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Quote Text</h3>
            
            <div>
              <Label htmlFor="text" className="text-orange-600">Quote Text (English) *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                placeholder="Enter the inspirational quote in English...

e.g., 'The mind is everything. What you think you become.'"
                rows={4}
                required
                className="resize-none"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Keep it concise and impactful</span>
                <span>{getCharacterCount(formData.text)}/500</span>
              </div>
            </div>

            <div>
              <Label htmlFor="text_hi">Quote Text (Hindi)</Label>
              <Textarea
                id="text_hi"
                value={formData.text_hi}
                onChange={(e) => handleInputChange('text_hi', e.target.value)}
                placeholder="उद्धरण हिंदी में...

उदाहरण: 'मन ही सब कुछ है। जो तुम सोचते हो, वही तुम बन जाते हो।'"
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Hindi translation or original Hindi quote</p>
            </div>
          </div>

          {/* Attribution Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Attribution</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="e.g., Buddha, Swami Vivekananda, Rumi"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Wisdom, Peace, Love, Meditation"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                placeholder="e.g., Bhagavad Gita, Dhammapada, Complete Works Vol. 1"
              />
            </div>
          </div>

          {/* Context & Tags Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Context & Tags</h3>
            
            <div>
              <Label htmlFor="context">Context & Background</Label>
              <Textarea
                id="context"
                value={formData.context}
                onChange={(e) => handleInputChange('context', e.target.value)}
                placeholder="Provide context about when, where, or why this quote was said...

Include:
- Historical context
- Circumstances of the saying
- Intended audience
- Deeper meaning explanation"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., wisdom, mindfulness, peace, self-realization, meditation"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas. These help users discover related quotes.
              </p>
              {formData.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {formData.text && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Preview</h3>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-100">
                <blockquote className="text-lg text-gray-700 italic mb-3">
                  "{formData.text}"
                </blockquote>
                {formData.text_hi && (
                  <blockquote className="text-base text-orange-600 font-medium mb-3">
                    "{formData.text_hi}"
                  </blockquote>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    - {formData.author || 'Unknown'}
                    {formData.source && `, ${formData.source}`}
                  </span>
                  {formData.category && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      {formData.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? 'Saving...' : (quote?.id ? 'Update Quote' : 'Add Quote')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}