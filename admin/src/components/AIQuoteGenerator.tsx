import { useState } from 'react'
import { Sparkles, Loader2, Check, X, Edit, Quote as QuoteIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface GeneratedQuote {
  text: string
  text_hi: string
  author: string
  category: string
  id?: string // temporary ID for UI
}

interface AIQuoteGeneratorProps {
  onQuotesPublished: () => void
}

const categories = [
  'Wisdom',
  'Love',
  'Peace',
  'Motivation',
  'Spirituality',
  'Meditation',
  'Karma',
  'Dharma',
  'Self-Knowledge',
  'Devotion'
]

export default function AIQuoteGenerator({ onQuotesPublished }: AIQuoteGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedQuotes, setGeneratedQuotes] = useState<GeneratedQuote[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Wisdom')
  const [quoteCount, setQuoteCount] = useState(5)
  const [theme, setTheme] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<GeneratedQuote | null>(null)
  const [publishingIds, setPublishingIds] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  const generateQuotes = async () => {
    setGenerating(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/quotes/generate-ai`, {
        count: quoteCount,
        category: selectedCategory,
        theme: theme || undefined
      })

      const quotesWithIds = response.data.quotes.map((q: GeneratedQuote, i: number) => ({
        ...q,
        id: `temp-${Date.now()}-${i}`
      }))

      setGeneratedQuotes(quotesWithIds)
      toast({
        title: '✨ AI Quotes Generated!',
        description: `Generated ${quotesWithIds.length} quotes successfully`
      })
    } catch (error: any) {
      console.error('Error generating quotes:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to generate quotes. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  const publishQuote = async (quote: GeneratedQuote) => {
    if (!quote.id) return

    setPublishingIds(prev => new Set(prev).add(quote.id!))
    try {
      const { error } = await supabase
        .from(TABLES.QUOTES)
        .insert({
          text: quote.text,
          text_hi: quote.text_hi,
          author: quote.author,
          category: quote.category,
          source: 'AI Generated',
          context: theme || null,
          tags: [selectedCategory, 'AI Generated']
        })

      if (error) throw error

      setGeneratedQuotes(prev => prev.filter(q => q.id !== quote.id))
      toast({
        title: '✅ Quote Published!',
        description: 'Quote added to your collection'
      })
      onQuotesPublished()
    } catch (error) {
      console.error('Error publishing quote:', error)
      toast({
        title: 'Error',
        description: 'Failed to publish quote. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setPublishingIds(prev => {
        const next = new Set(prev)
        next.delete(quote.id!)
        return next
      })
    }
  }

  const discardQuote = (quoteId: string) => {
    setGeneratedQuotes(prev => prev.filter(q => q.id !== quoteId))
    toast({
      title: 'Quote Discarded',
      description: 'Quote removed from preview'
    })
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditForm({ ...generatedQuotes[index] })
  }

  const saveEdit = () => {
    if (editingIndex === null || !editForm) return

    setGeneratedQuotes(prev => {
      const updated = [...prev]
      updated[editingIndex] = editForm
      return updated
    })
    setEditingIndex(null)
    setEditForm(null)
    toast({
      title: 'Quote Updated',
      description: 'Your changes have been saved'
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditForm(null)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate with AI
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white shadow-2xl">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Quote Generator</h2>
                    <p className="text-sm text-gray-600">Generate spiritual wisdom with AI</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false)
                    setGeneratedQuotes([])
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Generation Controls */}
              {generatedQuotes.length === 0 && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Quotes
                      </label>
                      <select
                        value={quoteCount}
                        onChange={(e) => setQuoteCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {[1, 3, 5, 7, 10].map(num => (
                          <option key={num} value={num}>{num} quotes</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., inner peace, mindfulness"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={generateQuotes}
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 text-lg"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating {quoteCount} quotes...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Quotes
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Generated Quotes Preview */}
              {generatedQuotes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Generated Quotes ({generatedQuotes.length})
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setGeneratedQuotes([])}
                      size="sm"
                    >
                      Generate New
                    </Button>
                  </div>

                  {generatedQuotes.map((quote, index) => (
                    <Card key={quote.id} className="border-2 border-purple-100">
                      <CardContent className="p-4">
                        {editingIndex === index ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                English Text
                              </label>
                              <textarea
                                value={editForm?.text}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, text: e.target.value } : null)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hindi Text
                              </label>
                              <textarea
                                value={editForm?.text_hi}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, text_hi: e.target.value } : null)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Author
                                </label>
                                <input
                                  type="text"
                                  value={editForm?.author}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, author: e.target.value } : null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  value={editForm?.category}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, category: e.target.value } : null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                  {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={saveEdit} size="sm" className="flex-1">
                                <Check className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button onClick={cancelEdit} variant="outline" size="sm" className="flex-1">
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <QuoteIcon className="h-5 w-5 text-purple-600" />
                                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                  {quote.category}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => publishQuote(quote)}
                                  disabled={publishingIds.has(quote.id!)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  {publishingIds.has(quote.id!) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => discardQuote(quote.id!)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <blockquote className="text-lg text-gray-900 leading-relaxed mb-2">
                              "{quote.text}"
                            </blockquote>

                            <p className="text-base text-purple-600 mb-3">
                              "{quote.text_hi}"
                            </p>

                            <p className="text-sm text-gray-600">
                              - {quote.author}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
