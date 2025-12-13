import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface SpiritualPost {
  id: string
  title: string
  title_hi: string | null
  content: string
  content_hi: string | null
  image_url: string | null
  category: string
  is_published: boolean
  created_at: string
  updated_at: string
}

interface SpacePostFormProps {
  post?: SpiritualPost | null
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  'Daily Wisdom',
  'Bhagavad Gita',
  'Festivals',
  'Stories',
  'Teachings',
  'Meditation',
  'Prayer',
  'Saints',
  'Devotional',
  'General'
]

export default function SpacePostForm({ post, onClose, onSuccess }: SpacePostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    title_hi: '',
    content: '',
    content_hi: '',
    image_url: '',
    category: 'General',
    is_published: true
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update form data when post prop changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        title_hi: post.title_hi || '',
        content: post.content || '',
        content_hi: post.content_hi || '',
        image_url: post.image_url || '',
        category: post.category || 'General',
        is_published: post.is_published !== undefined ? post.is_published : true
      })
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        title_hi: '',
        content: '',
        content_hi: '',
        image_url: '',
        category: 'General',
        is_published: true
      })
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const dataToSave = {
        title: formData.title.trim(),
        title_hi: formData.title_hi.trim() || null,
        content: formData.content.trim(),
        content_hi: formData.content_hi.trim() || null,
        image_url: formData.image_url.trim() || null,
        category: formData.category,
        is_published: formData.is_published
      }

      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('spiritual_posts')
          .update(dataToSave)
          .eq('id', post.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Post updated successfully"
        })
      } else {
        // Create new post
        const { error } = await supabase
          .from('spiritual_posts')
          .insert([dataToSave])

        if (error) throw error

        toast({
          title: "Success",
          description: "Post created successfully"
        })
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: "Error",
        description: `Failed to ${post ? 'update' : 'create'} post. Please try again.`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {post ? 'Edit Post' : 'Create New Post'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Share spiritual wisdom with the community
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* Title (English) */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title (English) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter post title in English"
              className="mt-1"
              required
            />
          </div>

          {/* Title (Hindi) */}
          <div>
            <Label htmlFor="title_hi" className="text-sm font-medium text-gray-700">
              Title (Hindi)
            </Label>
            <Input
              id="title_hi"
              value={formData.title_hi}
              onChange={(e) => handleChange('title_hi', e.target.value)}
              placeholder="हिंदी में शीर्षक दर्ज करें"
              className="mt-1"
            />
          </div>

          {/* Content (English) */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Content (English) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter post content in English..."
              className="mt-1 min-h-[150px]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} characters
            </p>
          </div>

          {/* Content (Hindi) */}
          <div>
            <Label htmlFor="content_hi" className="text-sm font-medium text-gray-700">
              Content (Hindi)
            </Label>
            <Textarea
              id="content_hi"
              value={formData.content_hi}
              onChange={(e) => handleChange('content_hi', e.target.value)}
              placeholder="हिंदी में सामग्री दर्ज करें..."
              className="mt-1 min-h-[150px]"
            />
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image_url" className="text-sm font-medium text-gray-700">
              Image URL
            </Label>
            <div className="mt-1">
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px, Max 2MB (JPG, PNG, WebP)
              </p>
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-3">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="rounded-lg max-h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3Crect fill="%23ddd" width="200" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Published Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => handleChange('is_published', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <Label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Publish immediately
            </Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {post ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                post ? 'Update Post' : 'Create Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
