import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: string
  tags: string[]
  reading_time: number
  featured: boolean
  featured_image?: string
  spiritual_quotes?: string[]
  related_saints?: string[]
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  status: 'draft' | 'published'
  published_at?: string
}

interface BlogFormProps {
  post?: BlogPost | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function BlogForm({ post, isOpen, onClose, onSave }: BlogFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [tagInput, setTagInput] = useState('')
  const [quoteInput, setQuoteInput] = useState('')
  const [saintInput, setSaintInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    tags: [] as string[],
    reading_time: 5,
    featured: false,
    featured_image: '',
    spiritual_quotes: [] as string[],
    related_saints: [] as string[],
    meta_title: '',
    meta_description: '',
    meta_keywords: [] as string[],
    status: 'draft' as 'draft' | 'published'
  })

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  // Update form when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category_id: post.category_id || '',
        tags: post.tags || [],
        reading_time: post.reading_time || 5,
        featured: post.featured || false,
        featured_image: post.featured_image || '',
        spiritual_quotes: post.spiritual_quotes || [],
        related_saints: post.related_saints || [],
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || [],
        status: post.status || 'draft'
      })
      setImagePreview(post.featured_image || null)
    } else {
      resetForm()
    }
  }, [post])

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: '',
      tags: [],
      reading_time: 5,
      featured: false,
      featured_image: '',
      spiritual_quotes: [],
      related_saints: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      status: 'draft'
    })
    setImagePreview(null)
    setTagInput('')
    setQuoteInput('')
    setSaintInput('')
    setKeywordInput('')
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      })
      return
    }

    try {
      setUploading(true)

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('santvaani-assets')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('santvaani-assets')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, featured_image: publicUrl }))
      setImagePreview(publicUrl)

      toast({
        title: 'Image uploaded',
        description: 'Featured image uploaded successfully'
      })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  // Remove image
  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image: '' }))
    setImagePreview(null)
  }

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  // Add spiritual quote
  const addQuote = () => {
    if (quoteInput.trim()) {
      setFormData(prev => ({
        ...prev,
        spiritual_quotes: [...(prev.spiritual_quotes || []), quoteInput.trim()]
      }))
      setQuoteInput('')
    }
  }

  // Remove quote
  const removeQuote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      spiritual_quotes: prev.spiritual_quotes.filter((_, i) => i !== index)
    }))
  }

  // Add saint
  const addSaint = () => {
    if (saintInput.trim()) {
      setFormData(prev => ({
        ...prev,
        related_saints: [...(prev.related_saints || []), saintInput.trim()]
      }))
      setSaintInput('')
    }
  }

  // Remove saint
  const removeSaint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      related_saints: prev.related_saints.filter((_, i) => i !== index)
    }))
  }

  // Add keyword
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        meta_keywords: [...prev.meta_keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  // Remove keyword
  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter(k => k !== keyword)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug || !formData.content || !formData.category_id) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const postData = {
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      }

      if (post?.id) {
        // Update existing post
        const { error } = await supabase
          .from(TABLES.BLOG_POSTS)
          .update(postData)
          .eq('id', post.id)

        if (error) throw error

        toast({
          title: 'Success!',
          description: 'Blog post updated successfully'
        })
      } else {
        // Create new post
        const { error } = await supabase
          .from(TABLES.BLOG_POSTS)
          .insert([postData])

        if (error) throw error

        toast({
          title: 'Success!',
          description: 'Blog post created successfully'
        })
      }

      resetForm()
      onSave()
      onClose()
    } catch (error: any) {
      console.error('Error saving blog post:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            {post ? 'Update the blog post details' : 'Add a new spiritual wisdom article'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                <Input
                  id="reading_time"
                  type="number"
                  value={formData.reading_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                  min="1"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary of the post"
                  rows={2}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="content">Content * (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here..."
                  rows={12}
                  required
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Featured Image</h3>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-sm text-gray-600 mb-2">
                    Click to upload featured image (Max 5MB)
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span>
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </>
                      )}
                    </span>
                  </Button>
                </Label>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tags</h3>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Spiritual Quotes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Spiritual Quotes</h3>
            <div className="flex gap-2">
              <Textarea
                value={quoteInput}
                onChange={(e) => setQuoteInput(e.target.value)}
                placeholder="Add a spiritual quote"
                rows={2}
              />
              <Button type="button" onClick={addQuote}>Add</Button>
            </div>
            <div className="space-y-2">
              {formData.spiritual_quotes?.map((quote, index) => (
                <div key={index} className="bg-orange-50 p-3 rounded-lg flex justify-between items-start">
                  <p className="italic text-sm">"{quote}"</p>
                  <X className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => removeQuote(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Related Saints */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Related Saints</h3>
            <div className="flex gap-2">
              <Input
                value={saintInput}
                onChange={(e) => setSaintInput(e.target.value)}
                placeholder="Add related saint name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSaint())}
              />
              <Button type="button" onClick={addSaint}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.related_saints?.map((saint, index) => (
                <Badge key={index} variant="outline">
                  {saint}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeSaint(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* SEO Meta */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">SEO Meta</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title (leave empty to use post title)"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description"
                  rows={2}
                />
              </div>

              <div className="col-span-2">
                <Label>Meta Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add SEO keyword"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.meta_keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Publishing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Blog Post'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
