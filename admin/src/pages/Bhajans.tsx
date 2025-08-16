import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Music, Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import BhajanForm from '@/components/BhajanForm'
import BhajanViewModal from '@/components/BhajanViewModal'
import BulkImport from '@/components/BulkImport'

// Bhajan interface matching your database schema
interface Bhajan {
  id: string
  title: string
  title_hi: string | null
  category: string | null
  lyrics: string | null
  lyrics_hi: string | null
  meaning: string | null
  author: string | null
  youtube_url: string | null
  created_at: string
  updated_at: string | null
}

export default function BhajansPage() {
  const [bhajans, setBhajans] = useState<Bhajan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBhajans, setSelectedBhajans] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBhajan, setEditingBhajan] = useState<Bhajan | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewingBhajan, setViewingBhajan] = useState<Bhajan | null>(null)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  
  const { toast } = useToast()

  // Fetch all bhajans from database
  const fetchBhajans = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.BHAJANS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setBhajans(data || [])
    } catch (error) {
      console.error('Error fetching bhajans:', error)
      toast({
        title: "Error",
        description: "Failed to load bhajans. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete bhajan
  const deleteBhajan = async (bhajanId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.BHAJANS)
        .delete()
        .eq('id', bhajanId)

      if (error) throw error

      setBhajans(bhajans.filter(b => b.id !== bhajanId))
      toast({
        title: "Success",
        description: "Bhajan deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting bhajan:', error)
      toast({
        title: "Error", 
        description: "Failed to delete bhajan. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Delete multiple bhajans
  const deleteSelectedBhajans = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.BHAJANS)
        .delete()
        .in('id', selectedBhajans)

      if (error) throw error

      setBhajans(bhajans.filter(b => !selectedBhajans.includes(b.id)))
      setSelectedBhajans([])
      toast({
        title: "Success",
        description: `${selectedBhajans.length} bhajans deleted successfully`
      })
    } catch (error) {
      console.error('Error deleting bhajans:', error)
      toast({
        title: "Error",
        description: "Failed to delete selected bhajans. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Export bhajans list to JSON
  const exportBhajansToCSV = () => {
    const bhajanTitles = bhajans.map(bhajan => bhajan.title)
    const jsonContent = JSON.stringify(bhajanTitles, null, 2)

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bhajan_titles_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `Exported ${bhajans.length} bhajan titles to JSON file`
    })
  }

  // Filter bhajans based on search
  const filteredBhajans = bhajans.filter(bhajan => 
    bhajan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bhajan.title_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bhajan.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bhajan.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bhajan.lyrics?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bhajan.lyrics_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bhajan.meaning?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handler functions
  const handleViewBhajan = (bhajan: Bhajan) => {
    setViewingBhajan(bhajan)
  }

  const handleEditBhajan = (bhajan: Bhajan) => {
    setEditingBhajan(bhajan)
  }

  const handleCloseBhajanView = () => {
    setViewingBhajan(null)
  }

  useEffect(() => {
    fetchBhajans()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bhajans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bhajans Management</h1>
          <p className="text-gray-600 mt-1">Manage sacred songs and devotional music</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={exportBhajansToCSV}
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
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bhajan
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{bhajans.length}</div>
          <div className="text-sm text-gray-600">Total Bhajans</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {bhajans.filter(b => b.youtube_url).length}
          </div>
          <div className="text-sm text-gray-600">With YouTube Links</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {bhajans.filter(b => b.lyrics_hi).length}
          </div>
          <div className="text-sm text-gray-600">Hindi Content</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {filteredBhajans.length}
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
            placeholder="Search by title, author, category, lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
        
        {selectedBhajans.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={deleteSelectedBhajans}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedBhajans.length})
            </Button>
          </div>
        )}
      </div>

      {/* Bhajans Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed"
                 style={{ minWidth: '900px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBhajans.length === filteredBhajans.length && filteredBhajans.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBhajans(filteredBhajans.map(b => b.id))
                      } else {
                        setSelectedBhajans([])
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bhajan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Preview
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
              {filteredBhajans.map((bhajan) => (
                <tr 
                  key={bhajan.id}
                  className={selectedBhajans.includes(bhajan.id) ? 'bg-green-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBhajans.includes(bhajan.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBhajans([...selectedBhajans, bhajan.id])
                        } else {
                          setSelectedBhajans(selectedBhajans.filter(id => id !== bhajan.id))
                        }
                      }}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
                          <Music className="h-5 w-5 text-green-700" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bhajan.title}
                        </div>
                        {bhajan.title_hi && (
                          <div className="text-sm text-gray-500">
                            {bhajan.title_hi}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900">
                      {bhajan.category || 'Uncategorized'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bhajan.author || 'Unknown author'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="max-w-48">
                      <div className="text-gray-900 truncate">
                        {bhajan.lyrics ? bhajan.lyrics.split('\n')[0] : 'No lyrics'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {bhajan.meaning ? bhajan.meaning.slice(0, 50) + '...' : 'No meaning'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      {bhajan.youtube_url && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          YouTube Link
                        </span>
                      )}
                      {bhajan.lyrics_hi && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Hindi Lyrics
                        </span>
                      )}
                      {bhajan.meaning && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Has Meaning
                        </span>
                      )}
                      {(!bhajan.lyrics || !bhajan.meaning) && (
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
                        onClick={() => handleViewBhajan(bhajan)}
                        title="View bhajan details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBhajan(bhajan)}
                        title="Edit bhajan"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(bhajan.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete bhajan"
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

        {filteredBhajans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchQuery ? 'No bhajans found matching your search.' : 'No bhajans added yet.'}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try different search terms.' : 'Click "Add Bhajan" to get started.'}
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
              <h3 className="text-lg font-medium text-gray-900">Delete Bhajan</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete 
                  <strong className="text-gray-700 mx-1">
                    {bhajans.find(b => b.id === deleteConfirm)?.title}
                  </strong>? 
                  This action cannot be undone and will remove the bhajan from your website.
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
                  onClick={() => deleteBhajan(deleteConfirm)}
                >
                  Delete Bhajan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Bhajan Modal */}
      <BhajanViewModal
        bhajan={viewingBhajan}
        isOpen={!!viewingBhajan}
        onClose={handleCloseBhajanView}
        onEdit={(bhajan) => {
          setViewingBhajan(null)
          setEditingBhajan(bhajan)
        }}
      />

      {/* Add/Edit Bhajan Form */}
      <BhajanForm
        bhajan={editingBhajan}
        isOpen={isAddModalOpen || !!editingBhajan}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingBhajan(null)
        }}
        onSave={() => {
          fetchBhajans()
        }}
      />

      {/* Bulk Import Modal */}
      <BulkImport
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={fetchBhajans}
        tableName="bhajans"
        tableDisplayName="Bhajans"
        sampleFormat={`[
  {
    "title": "Hanuman Chalisa",
    "title_hi": "हनुमान चालीसा",
    "category": "Devotional",
    "lyrics": "श्रीगुरु चरन सरोज रज...",
    "lyrics_hi": "श्रीगुरु चरन सरोज रज...",
    "meaning": "Prayer to Lord Hanuman for strength and devotion",
    "author": "Tulsidas",
    "youtube_url": "https://www.youtube.com/watch?v=..."
  }
]`}
      />
    </div>
  )
}