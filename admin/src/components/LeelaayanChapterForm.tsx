import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import RichTextEditor from './RichTextEditor'
import MarkdownConverter from './MarkdownConverter'
import { Loader2, BookOpen, FileCode, Eye, Edit3, Sparkles, Clock, Type } from 'lucide-react'

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
  const [showPreview, setShowPreview] = useState(false)
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'hi'>('en')
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

  // Calculate word and character count
  const getContentStats = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = text.split(' ').filter(w => w.length > 0).length
    const chars = text.length
    return { words, chars }
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

  const statsEn = getContentStats(formData.content)
  const statsHi = getContentStats(formData.content_hi)

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Section with Stats */}
      <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Chapter Details</h3>
            <p className="text-sm text-gray-600">Create a beautiful spiritual story</p>
          </div>
        </div>

        {/* Chapter Number & Read Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="chapter_number" className="text-gray-700 font-semibold">Chapter Number *</Label>
            <Input
              id="chapter_number"
              type="number"
              value={formData.chapter_number}
              onChange={(e) => setFormData(prev => ({ ...prev, chapter_number: parseInt(e.target.value) || 1 }))}
              min={1}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="read_time" className="text-gray-700 font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Read Time (min)
            </Label>
            <Input
              id="read_time"
              type="number"
              value={formData.read_time}
              onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 10 }))}
              min={1}
              className="mt-1"
            />
            <p className="text-xs text-orange-600 mt-1 font-medium">Auto-calculated</p>
          </div>
          <div className="flex items-end">
            <div className="bg-white rounded-lg p-3 border border-orange-200 w-full">
              <div className="flex items-center gap-2 text-sm">
                <Type className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-gray-700">
                  {statsEn.words} words, {statsEn.chars} chars (EN)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Metadata Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Title & Metadata</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-gray-700 font-semibold">Title (English) *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="The Beginning"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="title_hi" className="text-gray-700 font-semibold">Title (Hindi) *</Label>
            <Input
              id="title_hi"
              value={formData.title_hi}
              onChange={(e) => setFormData(prev => ({ ...prev, title_hi: e.target.value }))}
              placeholder="आरम्भ"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="slug" className="text-gray-700 font-semibold">Slug (URL) *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="the-beginning"
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1 italic">
            Auto-generated from title. This will be the URL for this chapter.
          </p>
        </div>

        <div>
          <Label htmlFor="chapter_image" className="text-gray-700 font-semibold">Chapter Image URL (optional)</Label>
          <Input
            id="chapter_image"
            value={formData.chapter_image}
            onChange={(e) => setFormData(prev => ({ ...prev, chapter_image: e.target.value }))}
            placeholder="https://example.com/chapter-image.jpg"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1 italic">
            Decorative image shown at the end of the chapter
          </p>
          {formData.chapter_image && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <img src={formData.chapter_image} alt="Chapter preview" className="w-48 h-32 object-cover rounded shadow-md" />
            </div>
          )}
        </div>
      </div>

      {/* Content Section - English */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Content (English)</h4>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowPreview(!showPreview)
              setPreviewLanguage('en')
            }}
            className={`${showPreview && previewLanguage === 'en' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-gray-50'}`}
          >
            {showPreview && previewLanguage === 'en' ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview && previewLanguage === 'en' ? 'Edit Mode' : 'Preview'}
          </Button>
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
          <div className="ml-auto bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
              <Type className="w-3.5 h-3.5" />
              {statsEn.words} words
              <Clock className="w-3.5 h-3.5 ml-2" />
              {formData.read_time} min read
            </div>
          </div>
        </div>

        {showPreview && previewLanguage === 'en' ? (
          <div className="border-2 border-orange-300 rounded-xl p-6 bg-gradient-to-br from-white to-orange-50 min-h-[400px]">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400 italic">No content yet. Start writing to see the preview!</p>' }} />
            </div>
          </div>
        ) : (
          <>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write the chapter content in English... Use headings, bold text, italics to make it beautiful!"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 bg-blue-50 border border-blue-200 rounded px-3 py-2">
              <strong>💡 Tip:</strong> Use <code className="bg-blue-100 px-1 rounded">&lt;h2&gt;</code> for chapter titles,
              <code className="bg-blue-100 px-1 rounded ml-1">&lt;p&gt;</code> for paragraphs.
              Or click "Import from Markdown" to paste Markdown content!
            </p>
          </>
        )}
      </div>

      {/* Content Section - Hindi */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">सामग्री (हिंदी)</h4>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowPreview(!showPreview)
              setPreviewLanguage('hi')
            }}
            className={`${showPreview && previewLanguage === 'hi' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-gray-50'}`}
          >
            {showPreview && previewLanguage === 'hi' ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview && previewLanguage === 'hi' ? 'संपादन मोड' : 'पूर्वावलोकन'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMarkdownConverterOpenHi(true)}
            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
          >
            <FileCode className="w-4 h-4 mr-2" />
            Markdown से आयात करें
          </Button>
          <div className="ml-auto bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
              <Type className="w-3.5 h-3.5" />
              {statsHi.words} शब्द
            </div>
          </div>
        </div>

        {showPreview && previewLanguage === 'hi' ? (
          <div className="border-2 border-orange-300 rounded-xl p-6 bg-gradient-to-br from-white to-orange-50 min-h-[400px]">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content_hi || '<p class="text-gray-400 italic">अभी तक कोई सामग्री नहीं। पूर्वावलोकन देखने के लिए लिखना शुरू करें!</p>' }} />
            </div>
          </div>
        ) : (
          <>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <RichTextEditor
                value={formData.content_hi}
                onChange={(value) => setFormData(prev => ({ ...prev, content_hi: value }))}
                placeholder="हिंदी में अध्याय की सामग्री लिखें... शीर्षक, बोल्ड टेक्स्ट, इटैलिक का उपयोग करके इसे सुंदर बनाएं!"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 bg-blue-50 border border-blue-200 rounded px-3 py-2">
              <strong>💡 सुझाव:</strong> या Markdown सामग्री पेस्ट करने के लिए "Markdown से आयात करें" पर क्लिक करें!
            </p>
          </>
        )}
      </div>

      {/* Writing Tips */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2.5 rounded-lg flex-shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-bold text-gray-800 mb-3 text-base">✨ Writing Tips for Beautiful Stories</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-orange-200">
                <p className="font-semibold text-orange-800 mb-1">📝 Structure</p>
                <ul className="space-y-1 text-gray-700 text-xs">
                  <li>• Use <code className="bg-orange-100 px-1 rounded">&lt;h2&gt;</code> for chapter headings</li>
                  <li>• Use <code className="bg-orange-100 px-1 rounded">&lt;p&gt;</code> for paragraphs</li>
                  <li>• First letter becomes a drop cap automatically!</li>
                </ul>
              </div>
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-orange-200">
                <p className="font-semibold text-orange-800 mb-1">🎨 Formatting</p>
                <ul className="space-y-1 text-gray-700 text-xs">
                  <li>• Use <strong>bold</strong> for emphasis</li>
                  <li>• Use <em>italic</em> for thoughts/quotes</li>
                  <li>• Keep paragraphs concise for readability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Published Toggle */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
          />
          <div>
            <Label htmlFor="published" className="cursor-pointer font-semibold text-gray-800">
              Publish this chapter
            </Label>
            <p className="text-xs text-gray-600 mt-0.5">Make it visible to users on the frontend</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 shadow-md hover:shadow-lg transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {chapter ? '✓ Update Chapter' : '+ Create Chapter'}
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
