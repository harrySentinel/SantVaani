import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import QuoteForm from '@/components/QuoteForm'
import QuoteViewModal from '@/components/QuoteViewModal'
import AIQuoteGenerator from '@/components/AIQuoteGenerator'

// Quote interface matching your database schema
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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<QuoteItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewingQuote, setViewingQuote] = useState<QuoteItem | null>(null)
  
  const { toast } = useToast()

  // Fetch all quotes from database
  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.QUOTES)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setQuotes(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast({
        title: "Error",
        description: "Failed to load quotes. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete quote
  const deleteQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.QUOTES)
        .delete()
        .eq('id', quoteId)

      if (error) throw error

      setQuotes(quotes.filter(q => q.id !== quoteId))
      toast({
        title: "Success",
        description: "Quote deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting quote:', error)
      toast({
        title: "Error", 
        description: "Failed to delete quote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Delete multiple quotes
  const deleteSelectedQuotes = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.QUOTES)
        .delete()
        .in('id', selectedQuotes)

      if (error) throw error

      setQuotes(quotes.filter(q => !selectedQuotes.includes(q.id)))
      setSelectedQuotes([])
      toast({
        title: "Success",
        description: `${selectedQuotes.length} quotes deleted successfully`
      })
    } catch (error) {
      console.error('Error deleting quotes:', error)
      toast({
        title: "Error",
        description: "Failed to delete selected quotes. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Filter quotes based on search
  const filteredQuotes = quotes.filter(quote => 
    quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.text_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (quote.tags && quote.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  )

  // Handler functions
  const handleViewQuote = (quote: QuoteItem) => {
    setViewingQuote(quote)
  }

  const handleEditQuote = (quote: QuoteItem) => {
    setEditingQuote(quote)
  }

  const handleCloseQuoteView = () => {
    setViewingQuote(null)
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quotes Management</h1>
          <p className="text-gray-600 mt-1">Manage spiritual wisdom and divine sayings</p>
        </div>
        <div className="flex space-x-3">
          <AIQuoteGenerator onQuotesPublished={fetchQuotes} />
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Quote
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{quotes.length}</div>
          <div className="text-sm text-gray-600">Total Quotes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {quotes.filter(q => q.text_hi).length}
          </div>
          <div className="text-sm text-gray-600">Hindi Content</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {quotes.filter(q => q.source).length}
          </div>
          <div className="text-sm text-gray-600">With Source</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {filteredQuotes.length}
          </div>
          <div className="text-sm text-gray-600">Search Results</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <input
            type="text"
            placeholder="Search by text, author, category, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
        
        {selectedQuotes.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={deleteSelectedQuotes}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedQuotes.length})
            </Button>
          </div>
        )}
      </div>

      {/* Quotes Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed"
                 style={{ minWidth: '900px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuotes(filteredQuotes.map(q => q.id))
                      } else {
                        setSelectedQuotes([])
                      }
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote Text
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author & Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr 
                  key={quote.id}
                  className={selectedQuotes.includes(quote.id) ? 'bg-orange-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedQuotes([...selectedQuotes, quote.id])
                        } else {
                          setSelectedQuotes(selectedQuotes.filter(id => id !== quote.id))
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-sm">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        "{quote.text.length > 80 ? quote.text.substring(0, 80) + '...' : quote.text}"
                      </div>
                      {quote.text_hi && (
                        <div className="text-sm text-orange-600 mt-1 line-clamp-1">
                          "{quote.text_hi.length > 50 ? quote.text_hi.substring(0, 50) + '...' : quote.text_hi}"
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900 font-medium">
                      {quote.author || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-32">
                      {quote.source || 'No source'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900">
                      {quote.category || 'Uncategorized'}
                    </div>
                    {quote.tags && quote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {quote.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                            {tag}
                          </span>
                        ))}
                        {quote.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{quote.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      {quote.text_hi && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Hindi Text
                        </span>
                      )}
                      {quote.source && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Has Source
                        </span>
                      )}
                      {quote.tags && quote.tags.length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {quote.tags.length} Tags
                        </span>
                      )}
                      {(!quote.author || !quote.source) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Incomplete
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQuote(quote)}
                        title="View quote details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuote(quote)}
                        title="Edit quote"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(quote.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete quote"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchQuery ? 'No quotes found matching your search.' : 'No quotes added yet.'}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try different search terms.' : 'Click "Add Quote" to get started.'}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900">Delete Quote</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this quote by 
                  <strong className="text-gray-700 mx-1">
                    {quotes.find(q => q.id === deleteConfirm)?.author || 'Unknown'}
                  </strong>? 
                  This action cannot be undone and will remove the quote from your website.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteQuote(deleteConfirm)}
                >
                  Delete Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Quote Modal */}
      <QuoteViewModal
        quote={viewingQuote}
        isOpen={!!viewingQuote}
        onClose={handleCloseQuoteView}
        onEdit={(quote) => {
          setViewingQuote(null)
          setEditingQuote(quote)
        }}
      />

      {/* Add/Edit Quote Form */}
      <QuoteForm
        quote={editingQuote}
        isOpen={isAddModalOpen || !!editingQuote}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingQuote(null)
        }}
        onSave={() => {
          fetchQuotes()
        }}
      />
    </div>
  )
}