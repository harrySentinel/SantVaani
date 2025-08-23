import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, BookOpen, Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import SpiritualFactForm from '@/components/SpiritualFactForm'
import SpiritualFactViewModal from '@/components/SpiritualFactViewModal'
import BulkImport from '@/components/BulkImport'

interface SpiritualFact {
  id: string
  text: string
  text_hi?: string
  category: string
  icon: string
  source?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export default function SpiritualFactsPage() {
  const [facts, setFacts] = useState<SpiritualFact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFacts, setSelectedFacts] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingFact, setEditingFact] = useState<SpiritualFact | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewingFact, setViewingFact] = useState<SpiritualFact | null>(null)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  
  const { toast } = useToast()

  // Fetch all spiritual facts from database
  const fetchFacts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('spiritual_facts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setFacts(data || [])
    } catch (error) {
      console.error('Error fetching spiritual facts:', error)
      toast({
        title: "Error",
        description: "Failed to load spiritual facts. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete spiritual fact
  const deleteFact = async (factId: string) => {
    try {
      const { error } = await supabase
        .from('spiritual_facts')
        .delete()
        .eq('id', factId)

      if (error) throw error

      setFacts(facts.filter(f => f.id !== factId))
      toast({
        title: "Success",
        description: "Spiritual fact deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting spiritual fact:', error)
      toast({
        title: "Error", 
        description: "Failed to delete spiritual fact. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Delete multiple spiritual facts
  const deleteSelectedFacts = async () => {
    try {
      const { error } = await supabase
        .from('spiritual_facts')
        .delete()
        .in('id', selectedFacts)

      if (error) throw error

      setFacts(facts.filter(f => !selectedFacts.includes(f.id)))
      setSelectedFacts([])
      toast({
        title: "Success",
        description: `${selectedFacts.length} spiritual facts deleted successfully`
      })
    } catch (error) {
      console.error('Error deleting spiritual facts:', error)
      toast({
        title: "Error",
        description: "Failed to delete selected spiritual facts. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Export spiritual facts to JSON
  const exportFactsToJSON = () => {
    const factsData = facts.map(fact => ({
      text: fact.text,
      text_hi: fact.text_hi,
      category: fact.category,
      icon: fact.icon,
      source: fact.source,
      is_active: fact.is_active
    }))
    const jsonContent = JSON.stringify(factsData, null, 2)

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `spiritual_facts_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `Exported ${facts.length} spiritual facts to JSON file`
    })
  }

  // Filter facts based on search
  const filteredFacts = facts.filter(fact => 
    fact.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fact.text_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fact.source?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handler functions
  const handleViewFact = (fact: SpiritualFact) => {
    setViewingFact(fact)
  }

  const handleEditFact = (fact: SpiritualFact) => {
    setEditingFact(fact)
  }

  const handleCloseFactView = () => {
    setViewingFact(null)
  }

  useEffect(() => {
    fetchFacts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading spiritual facts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Spiritual Facts Management</h1>
          <p className="text-gray-600 mt-1">Manage interesting spiritual facts displayed on homepage</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={exportFactsToJSON}
            variant="outline"
            className="w-full sm:w-auto text-green-600 border-green-200 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button
            onClick={() => setIsBulkImportOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Spiritual Fact
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{facts.length}</div>
          <div className="text-sm text-gray-600">Total Facts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {facts.filter(f => f.is_active).length}
          </div>
          <div className="text-sm text-gray-600">Active Facts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {facts.filter(f => f.text_hi).length}
          </div>
          <div className="text-sm text-gray-600">Hindi Content</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {filteredFacts.length}
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
            placeholder="Search by text, category, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
        
        {selectedFacts.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={deleteSelectedFacts}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedFacts.length})
            </Button>
          </div>
        )}
      </div>

      {/* Facts Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed"
                 style={{ minWidth: '900px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedFacts.length === filteredFacts.length && filteredFacts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFacts(filteredFacts.map(f => f.id))
                      } else {
                        setSelectedFacts([])
                      }
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fact Content
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source & Date
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
              {filteredFacts.map((fact) => (
                <tr 
                  key={fact.id}
                  className={selectedFacts.includes(fact.id) ? 'bg-orange-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedFacts.includes(fact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFacts([...selectedFacts, fact.id])
                        } else {
                          setSelectedFacts(selectedFacts.filter(id => id !== fact.id))
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-sm">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {fact.text.length > 80 ? fact.text.substring(0, 80) + '...' : fact.text}
                      </p>
                      {fact.text_hi && (
                        <p className="text-sm text-orange-600 mt-1 line-clamp-1">
                          {fact.text_hi.length > 50 ? fact.text_hi.substring(0, 50) + '...' : fact.text_hi}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {fact.text.length} chars
                        {fact.text_hi && ` • ${fact.text_hi.length} chars (hi)`}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{fact.icon}</span>
                      <span className="text-sm text-gray-900 font-medium">{fact.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="space-y-1">
                      {fact.source ? (
                        <div className="flex items-center text-gray-700">
                          <BookOpen className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-24">{fact.source}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-xs">No source</span>
                      )}
                      <div className="text-xs text-gray-500">
                        {formatDate(fact.created_at)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      <Badge 
                        variant={fact.is_active ? "default" : "secondary"}
                        className={fact.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {fact.is_active ? "Active" : "Inactive"}
                      </Badge>
                      
                      {fact.text_hi && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Hindi
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewFact(fact)}
                        title="View fact details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFact(fact)}
                        title="Edit fact"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(fact.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete fact"
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

        {filteredFacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchQuery ? 'No spiritual facts found matching your search.' : 'No spiritual facts added yet.'}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try different search terms.' : 'Click "Add Spiritual Fact" to get started.'}
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
              <h3 className="text-lg font-medium text-gray-900">Delete Spiritual Fact</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this spiritual fact? 
                  This action cannot be undone and will remove the fact from your website.
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
                  onClick={() => deleteFact(deleteConfirm)}
                >
                  Delete Fact
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Fact Modal */}
      <SpiritualFactViewModal
        fact={viewingFact}
        isOpen={!!viewingFact}
        onClose={handleCloseFactView}
        onEdit={(fact) => {
          setViewingFact(null)
          setEditingFact(fact)
        }}
      />

      {/* Add/Edit Fact Form */}
      <SpiritualFactForm
        fact={editingFact}
        isOpen={isAddModalOpen || !!editingFact}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingFact(null)
        }}
        onSave={() => {
          fetchFacts()
        }}
      />

      {/* Bulk Import Modal */}
      <BulkImport
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={fetchFacts}
        tableName="spiritual_facts"
        tableDisplayName="Spiritual Facts"
        sampleFormat={`[
  {
    "text": "Hanuman's heart contains an image of Rama and Sita inside it",
    "text_hi": "हनुमान के हृदय में राम और सीता की छवि है",
    "category": "Hindu Deities",
    "icon": "🕉️",
    "source": "Ramayana",
    "is_active": true
  },
  {
    "text": "The sacred syllable 'Om' is considered the primordial sound of the universe",
    "text_hi": "पवित्र अक्षर 'ॐ' को ब्रह्मांड की आदि ध्वनि माना जाता है",
    "category": "Mantras",
    "icon": "🔉",
    "source": "Vedas",
    "is_active": true
  }
]`}
      />
    </div>
  )
}