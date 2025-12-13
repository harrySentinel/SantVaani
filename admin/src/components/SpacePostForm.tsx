import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface SpiritualPost {
  id: string
  title: string
  title_hi: string | null
  content: string
  content_hi: string | null
  image_url: string | null
  profile_photo_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

interface SpacePostFormProps {
  post?: SpiritualPost | null
  onClose: () => void
  onSuccess: () => void
}

// Categories removed - this is now a personal social feed

export default function SpacePostForm({ post, onClose, onSuccess }: SpacePostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    title_hi: '',
    content: '',
    content_hi: '',
    image_url: '',
    profile_photo_url: '',
    is_published: true
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
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
        profile_photo_url: post.profile_photo_url || '',
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
        profile_photo_url: '',
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
        profile_photo_url: formData.profile_photo_url.trim() || null,
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file (JPG, PNG, WebP)",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive"
        })
        return
      }

      setUploading(true)

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('spiritual-posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('spiritual-posts')
        .getPublicUrl(filePath)

      // Update form with image URL
      setFormData(prev => ({ ...prev, image_url: publicUrl }))

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file (JPG, PNG, WebP)",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 1MB for profile photos)
      if (file.size > 1 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a profile photo smaller than 1MB",
          variant: "destructive"
        })
        return
      }

      setUploading(true)

      // Create unique filename for profile photo
      const fileExt = file.name.split('.').pop()
      const fileName = `profile-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('spiritual-posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('spiritual-posts')
        .getPublicUrl(filePath)

      // Update form with profile photo URL
      setFormData(prev => ({ ...prev, profile_photo_url: publicUrl }))

      toast({
        title: "Success",
        description: "Profile photo uploaded successfully"
      })
    } catch (error) {
      console.error('Error uploading profile photo:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
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

          {/* Image Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Post Image
            </Label>

            {/* Upload Button */}
            <div className="mt-1">
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploading
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 text-orange-600 animate-spin mr-2" />
                    <span className="text-sm text-orange-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload image or drag & drop
                    </span>
                  </>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px, Max 2MB (JPG, PNG, WebP)
              </p>
            </div>

            {/* OR divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Manual URL Input */}
            <div>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="Paste image URL here"
                type="url"
                disabled={uploading}
              />
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Preview:</p>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="rounded-lg max-h-48 object-cover w-full"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3Crect fill="%23ddd" width="200" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
          </div>

          {/* Profile Photo Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Profile Photo (Your Display Picture)
            </Label>

            {/* Upload Button */}
            <div className="mt-1">
              <label
                htmlFor="profile-photo-upload"
                className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploading
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 text-purple-600 animate-spin mr-2" />
                    <span className="text-sm text-purple-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload your profile photo
                    </span>
                  </>
                )}
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: Square image (500x500px), Max 1MB
              </p>
            </div>

            {/* OR divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Manual URL Input */}
            <div>
              <Input
                id="profile_photo_url"
                value={formData.profile_photo_url}
                onChange={(e) => handleChange('profile_photo_url', e.target.value)}
                placeholder="Paste profile photo URL here"
                type="url"
                disabled={uploading}
              />
            </div>

            {/* Profile Photo Preview */}
            {formData.profile_photo_url && (
              <div className="mt-3 flex items-center space-x-3">
                <img
                  src={formData.profile_photo_url}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E'
                  }}
                />
                <span className="text-xs text-gray-600">This is how you'll appear in posts</span>
              </div>
            )}
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
