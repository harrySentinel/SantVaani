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
    content: '',
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
        content: post.content || '',
        image_url: post.image_url || '',
        profile_photo_url: post.profile_photo_url || '',
        is_published: post.is_published !== undefined ? post.is_published : true
      })
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
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
        title_hi: null,
        content: formData.content.trim(),
        content_hi: null,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg z-10">
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
          {/* Profile Photo Upload - Instagram Style (First) */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Profile Photo
            </Label>

            <div className="flex items-center space-x-4">
              {/* Profile Photo Preview */}
              <div className="flex-shrink-0">
                {formData.profile_photo_url ? (
                  <img
                    src={formData.profile_photo_url}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Ccircle fill="%23ddd" cx="40" cy="40" r="40"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="24"%3E🕉️%3C/text%3E%3C/svg%3E'
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center">
                    <span className="text-3xl">🕉️</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label
                  htmlFor="profile-photo-upload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-colors ${
                    uploading
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Change Photo</span>
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
                <p className="text-xs text-gray-500 mt-2">
                  Square image recommended (500x500px), Max 1MB
                </p>
              </div>
            </div>

            {/* Optional: Manual URL Input */}
            <div className="mt-3">
              <Input
                id="profile_photo_url"
                value={formData.profile_photo_url}
                onChange={(e) => handleChange('profile_photo_url', e.target.value)}
                placeholder="Or paste image URL"
                type="url"
                disabled={uploading}
                className="text-sm"
              />
            </div>
          </div>

          {/* Caption/Title - Instagram Style */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Write a title..."
              className="mt-1 text-base"
              required
            />
          </div>

          {/* Caption - Instagram Style */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Caption <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write a caption... (You can write in English, Hindi, or both)"
              className="mt-1 min-h-[120px] text-base resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} characters
            </p>
          </div>

          {/* Post Image Upload - Instagram Style */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Post Image (Optional)
            </Label>

            {/* Image Preview */}
            {formData.image_url && (
              <div className="mb-4">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="rounded-lg max-h-64 object-cover w-full border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3Crect fill="%23ddd" width="200" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center space-x-3">
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-colors ${
                  uploading
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Add Photo</span>
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

              {formData.image_url && (
                <button
                  type="button"
                  onClick={() => handleChange('image_url', '')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Manual URL Input */}
            <div className="mt-3">
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="Or paste image URL"
                type="url"
                disabled={uploading}
                className="text-sm"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Max 2MB • JPG, PNG, WebP
            </p>
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
