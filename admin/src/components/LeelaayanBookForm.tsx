import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface Book {
  id: string
  title: string
  title_hi: string
  slug: string
  description: string
  description_hi: string
  cover_image?: string
  author: string
  author_hi: string
  total_chapters: number
  views: number
  published: boolean
}

interface LeelaayanBookFormProps {
  book: Book | null
  onSuccess: () => void
  onCancel: () => void
}

export default function LeelaayanBookForm({ book, onSuccess, onCancel }: LeelaayanBookFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    title_hi: '',
    slug: '',
    description: '',
    description_hi: '',
    cover_image: '',
    author: '',
    author_hi: '',
    published: false,
    is_santvaani_original: false
  })
  const { toast } = useToast()

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        title_hi: book.title_hi,
        slug: book.slug,
        description: book.description,
        description_hi: book.description_hi,
        cover_image: book.cover_image || '',
        author: book.author,
        author_hi: book.author_hi,
        published: book.published,
        is_santvaani_original: book.is_santvaani_original || false
      })
    }
  }, [book])

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.title_hi || !formData.slug || !formData.author) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const bookData = {
        title: formData.title,
        title_hi: formData.title_hi,
        slug: formData.slug,
        description: formData.description,
        description_hi: formData.description_hi,
        cover_image: formData.cover_image || null,
        author: formData.author,
        author_hi: formData.author_hi,
        published: formData.published,
        is_santvaani_original: formData.is_santvaani_original,
        updated_at: new Date().toISOString()
      }

      let error

      if (book) {
        // Update existing book
        const result = await supabase
          .from('leelaayen_books')
          .update(bookData)
          .eq('id', book.id)
        error = result.error
      } else {
        // Create new book
        const result = await supabase
          .from('leelaayen_books')
          .insert([{ ...bookData, total_chapters: 0, views: 0 }])
        error = result.error
      }

      if (error) throw error

      toast({
        title: 'Success',
        description: `Book ${book ? 'updated' : 'created'} successfully`
      })
      onSuccess()
    } catch (error: any) {
      console.error('Error saving book:', error)
      toast({
        title: 'Error',
        description: error.message || `Failed to ${book ? 'update' : 'create'} book`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title (English) *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Mahabharat"
            required
          />
        </div>
        <div>
          <Label htmlFor="title_hi">Title (Hindi) *</Label>
          <Input
            id="title_hi"
            value={formData.title_hi}
            onChange={(e) => setFormData(prev => ({ ...prev, title_hi: e.target.value }))}
            placeholder="महाभारत"
            required
          />
        </div>
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">Slug (URL) *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          placeholder="mahabharat"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          URL-friendly identifier (auto-generated from title)
        </p>
      </div>

      {/* Author Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Author (English) *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Veda Vyasa"
            required
          />
        </div>
        <div>
          <Label htmlFor="author_hi">Author (Hindi) *</Label>
          <Input
            id="author_hi"
            value={formData.author_hi}
            onChange={(e) => setFormData(prev => ({ ...prev, author_hi: e.target.value }))}
            placeholder="वेद व्यास"
            required
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="The great epic of ancient India..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="description_hi">Description (Hindi)</Label>
          <Textarea
            id="description_hi"
            value={formData.description_hi}
            onChange={(e) => setFormData(prev => ({ ...prev, description_hi: e.target.value }))}
            placeholder="प्राचीन भारत का महान महाकाव्य..."
            rows={4}
          />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <Label htmlFor="cover_image">Cover Image URL</Label>
        <Input
          id="cover_image"
          value={formData.cover_image}
          onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
          placeholder="https://example.com/cover.jpg"
        />
        {formData.cover_image && (
          <div className="mt-2">
            <img src={formData.cover_image} alt="Cover preview" className="w-32 h-48 object-cover rounded shadow" />
          </div>
        )}
      </div>

      {/* Published Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
        />
        <Label htmlFor="published" className="cursor-pointer">
          Publish this book (make it visible to users)
        </Label>
      </div>

      {/* SantVaani Original Toggle */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Switch
            id="santvaani_original"
            checked={formData.is_santvaani_original}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_santvaani_original: checked }))}
          />
          <Label htmlFor="santvaani_original" className="cursor-pointer flex items-center gap-2">
            <span className="text-base font-semibold">⭐ SantVaani Original</span>
          </Label>
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-11">
          Mark this as exclusive content created by SantVaani. A special badge will be displayed on the book.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {book ? 'Update Book' : 'Create Book'}
        </Button>
      </div>
    </form>
  )
}
