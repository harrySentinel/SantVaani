import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import RichTextEditor from './RichTextEditor'
import MarkdownConverter from './MarkdownConverter'
import { Loader2, BookOpen, FileCode } from 'lucide-react'

interface Chapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  title_hi: string
  slug: string
  content: string
  content_hi: string
  chapter_image?: string
  read_time: number
  published: boolean
}

interface LeelaayanChapterFormProps {
  chapter: Chapter | null
  bookId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function LeelaayanChapterForm({ chapter, bookId, onSuccess, onCancel }: LeelaayanChapterFormProps) {
  const [loading, setLoading] = useState(false)
  const [isMarkdownConverterOpen, setIsMarkdownConverterOpen] = useState(false)
  const [isMarkdownConverterOpenHi, setIsMarkdownConverterOpenHi] = useState(false)
  const [formData, setFormData] = useState({
    chapter_number: 1,
    title: '',
    title_hi: '',
    slug: '',
    content: '',
    content_hi: '',
    chapter_image: '',
    read_time: 10,
    published: false
  })
  const { toast } = useToast()

  useEffect(() => {
    if (chapter) {
      setFormData({
        chapter_number: chapter.chapter_number,
        title: chapter.title,
        title_hi: chapter.title_hi,
        slug: chapter.slug,
        content: chapter.content,
        content_hi: chapter.content_hi,
        chapter_image: chapter.chapter_image || '',
        read_time: chapter.read_time,
        published: chapter.published
      })
    } else {
      // Auto-generate next chapter number
      loadNextChapterNumber()
    }
  }, [chapter])

  const loadNextChapterNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('leelaayen_chapters')
        .select('chapter_number')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      const nextNumber = data ? data.chapter_number + 1 : 1
      setFormData(prev => ({ ...prev, chapter_number: nextNumber }))
    } catch (error) {
      console.error('Error loading next chapter number:', error)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }))
  }

  // Auto-calculate read time from content (rough estimate: 200 words per minute)
  const calculateReadTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = text.split(' ').length
    const minutes = Math.max(1, Math.ceil(wordCount / 200))
    return minutes
  }

  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: value,
      read_time: calculateReadTime(value)
    }))
  }

  // Handle Markdown conversion for English content
  const handleMarkdownConvert = (html: string) => {
    setFormData(prev => ({
      ...prev,
      content: html,
      read_time: calculateReadTime(html)
    }))
  }

  // Handle Markdown conversion for Hindi content
  const handleMarkdownConvertHi = (html: string) => {
    setFormData(prev => ({ ...prev, content_hi: html }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.title_hi || !formData.slug || !formData.content) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const chapterData = {
        book_id: bookId,
        chapter_number: formData.chapter_number,
        title: formData.title,
        title_hi: formData.title_hi,
        slug: formData.slug,
        content: formData.content,
        content_hi: formData.content_hi,
        chapter_image: formData.chapter_image || null,
        read_time: formData.read_time,
        published: formData.published,
        updated_at: new Date().toISOString()
      }

      let error

      if (chapter) {
        // Update existing chapter
        const result = await supabase
          .from('leelaayen_chapters')
          .update(chapterData)
          .eq('id', chapter.id)
        error = result.error
      } else {
        // Create new chapter
        const result = await supabase
          .from('leelaayen_chapters')
          .insert([{ ...chapterData, views: 0 }])
        error = result.error
      }

      if (error) throw error

      // Update book's total_chapters count
      if (!chapter) {
        const { data: book } = await supabase
          .from('leelaayen_books')
          .select('total_chapters')
          .eq('id', bookId)
          .single()

        if (book) {
          await supabase
            .from('leelaayen_books')
            .update({ total_chapters: (book.total_chapters || 0) + 1 })
            .eq('id', bookId)
        }
      }

      toast({
        title: 'Success',
        description: `Chapter ${chapter ? 'updated' : 'created'} successfully`
      })
      onSuccess()
    } catch (error: any) {
      console.error('Error saving chapter:', error)
      toast({
        title: 'Error',
        description: error.message || `Failed to ${chapter ? 'update' : 'create'} chapter`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Chapter Number & Read Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="chapter_number">Chapter Number *</Label>
          <Input
            id="chapter_number"
            type="number"
            value={formData.chapter_number}
            onChange={(e) => setFormData(prev => ({ ...prev, chapter_number: parseInt(e.target.value) || 1 }))}
            min={1}
            required
          />
        </div>
        <div>
          <Label htmlFor="read_time">Read Time (minutes)</Label>
          <Input
            id="read_time"
            type="number"
            value={formData.read_time}
            onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 10 }))}
            min={1}
          />
          <p className="text-xs text-gray-500 mt-1">Auto-calculated from content</p>
        </div>
      </div>

      {/* Title Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title (English) *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="The Beginning"
            required
          />
        </div>
        <div>
          <Label htmlFor="title_hi">Title (Hindi) *</Label>
          <Input
            id="title_hi"
            value={formData.title_hi}
            onChange={(e) => setFormData(prev => ({ ...prev, title_hi: e.target.value }))}
            placeholder="आरम्भ"
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
          placeholder="the-beginning"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          URL-friendly identifier (auto-generated from title)
        </p>
      </div>

      {/* Chapter Image */}
      <div>
        <Label htmlFor="chapter_image">Chapter Image URL (optional)</Label>
        <Input
          id="chapter_image"
          value={formData.chapter_image}
          onChange={(e) => setFormData(prev => ({ ...prev, chapter_image: e.target.value }))}
          placeholder="https://example.com/chapter-image.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Decorative image shown at the end of the chapter
        </p>
        {formData.chapter_image && (
          <div className="mt-2">
            <img src={formData.chapter_image} alt="Chapter preview" className="w-48 h-32 object-cover rounded shadow" />
          </div>
        )}
      </div>

      {/* Content Section - English */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="content">Content (English) *</Label>
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
        <div className="mt-2 border rounded-lg overflow-hidden">
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write the chapter content in English... Use headings, bold text, italics to make it beautiful!"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use <strong>&lt;h2&gt;</strong> for chapter titles, <strong>&lt;p&gt;</strong> for paragraphs. Rich formatting supported!
          Or click "Import from Markdown" to paste Markdown content!
        </p>
      </div>

      {/* Content Section - Hindi */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="content_hi">Content (Hindi) *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMarkdownConverterOpenHi(true)}
            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
          >
            <FileCode className="w-4 h-4 mr-2" />
            Import from Markdown
          </Button>
        </div>
        <div className="mt-2 border rounded-lg overflow-hidden">
          <RichTextEditor
            value={formData.content_hi}
            onChange={(value) => setFormData(prev => ({ ...prev, content_hi: value }))}
            placeholder="हिंदी में अध्याय की सामग्री लिखें... शीर्षक, बोल्ड टेक्स्ट, इटैलिक का उपयोग करके इसे सुंदर बनाएं!"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          या Markdown सामग्री पेस्ट करने के लिए "Import from Markdown" पर क्लिक करें!
        </p>
      </div>

      {/* Preview Tips */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="text-sm text-orange-800">
            <p className="font-semibold mb-1">Writing Tips for Beautiful Stories:</p>
            <ul className="list-disc list-inside space-y-1 text-orange-700">
              <li>Start with <strong>&lt;h2&gt;</strong> for chapter heading: <code>&lt;h2&gt;Chapter 1: The Beginning&lt;/h2&gt;</code></li>
              <li>Use paragraphs <code>&lt;p&gt;</code> for each section of the story</li>
              <li>The first letter will automatically become a beautiful drop cap!</li>
              <li>Use <strong>bold</strong> for emphasis and <em>italic</em> for thoughts/quotes</li>
              <li>Keep paragraphs concise for better readability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
        />
        <Label htmlFor="published" className="cursor-pointer">
          Publish this chapter (make it visible to users)
        </Label>
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
          {chapter ? 'Update Chapter' : 'Create Chapter'}
        </Button>
      </div>
    </form>

    {/* Markdown Converter Modals */}
    <MarkdownConverter
      isOpen={isMarkdownConverterOpen}
      onClose={() => setIsMarkdownConverterOpen(false)}
      onConvert={handleMarkdownConvert}
    />
    <MarkdownConverter
      isOpen={isMarkdownConverterOpenHi}
      onClose={() => setIsMarkdownConverterOpenHi(false)}
      onConvert={handleMarkdownConvertHi}
    />
  </>
  )
}
