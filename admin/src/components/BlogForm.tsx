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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, CheckCircle, AlertCircle, Languages, Wand2, FileCode } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import MarkdownConverter from './MarkdownConverter'

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

  // AI Features
  const [aiLoading, setAiLoading] = useState(false)
  const [seoSuggestions, setSeoSuggestions] = useState<any>(null)
  const [contentLanguage, setContentLanguage] = useState<'hi' | 'en' | 'both'>('hi')
  const [translating, setTranslating] = useState(false)
  const [isMarkdownConverterOpen, setIsMarkdownConverterOpen] = useState(false)

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

  // AI SEO Optimization - Similar to Hashnode (Direct Groq API call)
  const generateSEOSuggestions = async () => {
    if (!formData.title || !formData.excerpt) {
      toast({
        title: 'Title and excerpt required',
        description: 'Please fill in title and excerpt first',
        variant: 'destructive'
      })
      return
    }

    setAiLoading(true)
    try {
      // Use Groq API directly from frontend (from environment variable)
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

      console.log('🔑 Checking API key...', GROQ_API_KEY ? 'Key found!' : 'Key missing!')

      if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured. Please add VITE_GROQ_API_KEY to environment variables.')
      }

      const languageContext = contentLanguage === 'hi'
        ? 'Hindi (हिंदी)'
        : contentLanguage === 'en'
        ? 'English'
        : 'both Hindi and English (bilingual)'

      const prompt = `You are an SEO expert for a spiritual blog platform called SantVaani. Generate SEO-optimized metadata for this blog post in ${languageContext}.

Blog Title: "${formData.title}"
Excerpt: "${formData.excerpt}"
${formData.content ? `First paragraph: "${formData.content.substring(0, 200)}..."` : ''}

Generate the following in JSON format:
{
  "metaTitle": "SEO-optimized title (50-60 characters, includes keywords)",
  "metaDescription": "Compelling meta description (150-160 characters, includes call-to-action)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "suggestedTags": ["tag1", "tag2", "tag3"]
}

IMPORTANT:
- metaTitle should be catchy and include main keywords
- metaDescription should be engaging and make people want to click
- Include spirituality-related keywords relevant to the content
- For Hindi content, use Hindi keywords; for English use English keywords
- Focus on Indian spiritual terms, saint names, and practices`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 800,
        })
      })

      if (!response.ok) throw new Error('Groq API error')

      const data = await response.json()
      const generatedText = data.choices?.[0]?.message?.content

      if (!generatedText) throw new Error('No response from AI')

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid AI response format')

      const suggestions = JSON.parse(jsonMatch[0])
      setSeoSuggestions(suggestions)

      toast({
        title: 'AI Suggestions Ready!',
        description: 'Review the SEO-optimized suggestions below',
      })
    } catch (error: any) {
      console.error('AI SEO Error:', error)

      // Fallback suggestions
      const fallbackSuggestions = {
        metaTitle: `${formData.title} | SantVaani Spiritual Blog`,
        metaDescription: formData.excerpt.substring(0, 157) + '...',
        keywords: ['spirituality', 'hindu wisdom', 'sant vaani', 'spiritual guidance', 'meditation'],
        suggestedTags: ['spirituality', 'wisdom', 'guidance']
      }

      setSeoSuggestions(fallbackSuggestions)

      toast({
        title: 'Using fallback suggestions',
        description: 'AI unavailable, showing basic SEO suggestions',
      })
    } finally {
      setAiLoading(false)
    }
  }

  // Apply AI suggestion
  const applySuggestion = (field: 'meta_title' | 'meta_description' | 'meta_keywords', value: any) => {
    if (field === 'meta_keywords' && Array.isArray(value)) {
      setFormData(prev => ({ ...prev, meta_keywords: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    toast({
      title: 'Applied!',
      description: 'AI suggestion has been applied',
    })
  }

  // Auto-translate content (Hindi <-> English) - Direct Groq API call
  const translateContent = async (targetLang: 'hi' | 'en') => {
    if (!formData.content) {
      toast({
        title: 'No content to translate',
        description: 'Please write some content first',
        variant: 'destructive'
      })
      return
    }

    setTranslating(true)
    try {
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

      if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured')
      }

      const targetLangName = targetLang === 'hi' ? 'Hindi (हिंदी)' : 'English'
      const sourceLangName = targetLang === 'hi' ? 'English' : 'Hindi (हिंदी)'

      const prompt = `You are a professional translator specializing in spiritual and religious content. Translate the following blog post from ${sourceLangName} to ${targetLangName}.

Title: "${formData.title}"
Excerpt: "${formData.excerpt}"
Content: "${formData.content.substring(0, 1000)}${formData.content.length > 1000 ? '...' : ''}"

IMPORTANT RULES:
1. Maintain spiritual terminology accurately (e.g., dharma, karma, bhakti)
2. Keep saint names in original form
3. Preserve emotional and spiritual tone
4. Use culturally appropriate expressions
5. Don't translate proper nouns like names of gods, saints, or sacred texts

Return ONLY a JSON object:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated content"
}`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.5,
          max_tokens: 2000,
        })
      })

      if (!response.ok) throw new Error('Groq API error')

      const data = await response.json()
      const generatedText = data.choices?.[0]?.message?.content

      if (!generatedText) throw new Error('No response from AI')

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid AI response format')

      const translated = JSON.parse(jsonMatch[0])

      // Update with translated content
      setFormData(prev => ({
        ...prev,
        title: translated.title || prev.title,
        excerpt: translated.excerpt || prev.excerpt,
        content: translated.content || prev.content
      }))

      toast({
        title: 'Translation Complete!',
        description: `Content translated to ${targetLang === 'hi' ? 'Hindi' : 'English'}`,
      })
    } catch (error: any) {
      console.error('Translation Error:', error)
      toast({
        title: 'Translation failed',
        description: 'Please try again or translate manually',
        variant: 'destructive'
      })
    } finally {
      setTranslating(false)
    }
  }

  // Handle Markdown conversion
  const handleMarkdownConvert = (html: string) => {
    setFormData(prev => ({ ...prev, content: html }))
  }

  // Calculate SEO Score
  const calculateSEOScore = () => {
    let score = 0
    const checks = []

    // Title length (50-60 chars is ideal)
    if (formData.meta_title.length >= 50 && formData.meta_title.length <= 60) {
      score += 20
      checks.push({ text: 'Title length optimal', passed: true })
    } else {
      checks.push({ text: 'Title should be 50-60 characters', passed: false })
    }

    // Description length (150-160 chars is ideal)
    if (formData.meta_description.length >= 150 && formData.meta_description.length <= 160) {
      score += 20
      checks.push({ text: 'Meta description length optimal', passed: true })
    } else {
      checks.push({ text: 'Meta description should be 150-160 characters', passed: false })
    }

    // Has keywords
    if (formData.meta_keywords.length >= 3) {
      score += 20
      checks.push({ text: 'Has sufficient keywords', passed: true })
    } else {
      checks.push({ text: 'Add at least 3 keywords', passed: false })
    }

    // Has excerpt
    if (formData.excerpt.length > 50) {
      score += 20
      checks.push({ text: 'Has good excerpt', passed: true })
    } else {
      checks.push({ text: 'Excerpt should be longer', passed: false })
    }

    // Has spiritual quotes
    if (formData.spiritual_quotes && formData.spiritual_quotes.length > 0) {
      score += 20
      checks.push({ text: 'Has spiritual quotes', passed: true })
    } else {
      checks.push({ text: 'Add spiritual quotes for engagement', passed: false })
    }

    return { score, checks }
  }

  const seoScore = calculateSEOScore()

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
          {/* Language Selection & AI Tools */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-orange-600" />
                AI-Powered Blog Editor
              </CardTitle>
              <CardDescription>
                Choose language and get AI-powered SEO suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={contentLanguage === 'hi' ? 'default' : 'outline'}
                  onClick={() => setContentLanguage('hi')}
                  className={contentLanguage === 'hi' ? 'bg-orange-600' : ''}
                >
                  <Languages className="w-4 h-4 mr-2" />
                  हिंदी Only
                </Button>
                <Button
                  type="button"
                  variant={contentLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => setContentLanguage('en')}
                  className={contentLanguage === 'en' ? 'bg-orange-600' : ''}
                >
                  <Languages className="w-4 h-4 mr-2" />
                  English Only
                </Button>
                <Button
                  type="button"
                  variant={contentLanguage === 'both' ? 'default' : 'outline'}
                  onClick={() => setContentLanguage('both')}
                  className={contentLanguage === 'both' ? 'bg-orange-600' : ''}
                >
                  <Languages className="w-4 h-4 mr-2" />
                  Bilingual
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={generateSEOSuggestions}
                  disabled={aiLoading || !formData.title}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate SEO Suggestions
                    </>
                  )}
                </Button>

                {contentLanguage === 'both' && (
                  <Button
                    type="button"
                    onClick={() => translateContent(formData.content.match(/[\u0900-\u097F]/) ? 'en' : 'hi')}
                    disabled={translating || !formData.content}
                    variant="outline"
                  >
                    {translating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="w-4 h-4 mr-2" />
                        Auto-Translate
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SEO Score Card */}
          <Card className={`border-2 ${seoScore.score >= 80 ? 'border-green-300 bg-green-50' : seoScore.score >= 60 ? 'border-yellow-300 bg-yellow-50' : 'border-red-300 bg-red-50'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">SEO Score</span>
                <span className={`text-3xl font-bold ${seoScore.score >= 80 ? 'text-green-600' : seoScore.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {seoScore.score}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {seoScore.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {check.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={check.passed ? 'text-green-700' : 'text-red-700'}>
                      {check.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Display */}
          {seoSuggestions && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI SEO Suggestions (Like Hashnode)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Optimized Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Optimized Meta Title:</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-white rounded border text-sm">
                      {seoSuggestions.metaTitle}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => applySuggestion('meta_title', seoSuggestions.metaTitle)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Optimized Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Optimized Meta Description:</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-white rounded border text-sm">
                      {seoSuggestions.metaDescription}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => applySuggestion('meta_description', seoSuggestions.metaDescription)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Suggested Keywords */}
                {seoSuggestions.keywords && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Suggested Keywords:</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex flex-wrap gap-2">
                        {seoSuggestions.keywords.map((kw: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{kw}</Badge>
                        ))}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => applySuggestion('meta_keywords', seoSuggestions.keywords)}
                      >
                        Apply All
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title * {contentLanguage === 'hi' && '(हिंदी में)'} {contentLanguage === 'en' && '(English)'}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={contentLanguage === 'hi' ? 'ब्लॉग पोस्ट का शीर्षक दर्ज करें' : 'Enter blog post title'}
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
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content">
                    Content *
                    <span className="ml-2 text-sm text-gray-500">
                      (Use toolbar to add headings, formatting, etc. Works with Hindi & English!)
                    </span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMarkdownConverterOpen(true)}
                    className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Import from Markdown
                  </Button>
                </div>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your blog post content here... Use the toolbar above to add headings (H1, H2, H3), bold text, lists, and more!"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Tip:</strong> You can paste Markdown content from Claude by clicking "Import from Markdown" button above!
                </p>
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

      {/* Markdown Converter Modal */}
      <MarkdownConverter
        isOpen={isMarkdownConverterOpen}
        onClose={() => setIsMarkdownConverterOpen(false)}
        onConvert={handleMarkdownConvert}
      />
    </Dialog>
  )
}
