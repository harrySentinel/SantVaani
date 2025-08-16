import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Upload, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate, truncateText } from '@/lib/utils'
import SaintForm from '@/components/SaintForm'
import SaintViewModal from '@/components/SaintViewModal'
import BulkImport from '@/components/BulkImport'

// Saint interface matching your database schema
interface Saint {
  id: string
  name: string
  name_hi: string | null
  period: string | null
  region: string | null
  image_url: string | null
  description: string | null
  description_hi: string | null
  specialty: string | null
  specialty_hi: string | null
  biography: string | null
  biography_hi: string | null
  created_at: string
  updated_at: string | null
}

export default function SaintsPage() {
  const [saints, setSaints] = useState<Saint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSaints, setSelectedSaints] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSaint, setEditingSaint] = useState<Saint | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewingSaint, setViewingSaint] = useState<Saint | null>(null)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  
  const { toast } = useToast()

  // Fetch all saints from database
  const fetchSaints = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.SAINTS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSaints(data || [])
    } catch (error) {
      console.error('Error fetching saints:', error)
      toast({
        title: "Error",
        description: "Failed to load saints. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete saint
  const deleteSaint = async (saintId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.SAINTS)
        .delete()
        .eq('id', saintId)

      if (error) throw error

      setSaints(saints.filter(s => s.id !== saintId))
      toast({
        title: "Success",
        description: "Saint deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting saint:', error)
      toast({
        title: "Error", 
        description: "Failed to delete saint. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Delete multiple saints
  const deleteSelectedSaints = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.SAINTS)
        .delete()
        .in('id', selectedSaints)

      if (error) throw error

      setSaints(saints.filter(s => !selectedSaints.includes(s.id)))
      setSelectedSaints([])
      toast({
        title: "Success",
        description: `${selectedSaints.length} saints deleted successfully`
      })
    } catch (error) {
      console.error('Error deleting saints:', error)
      toast({
        title: "Error",
        description: "Failed to delete selected saints. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Export saints list to JSON
  const exportSaintsToCSV = () => {
    const saintNames = saints.map(saint => saint.name)
    const jsonContent = JSON.stringify(saintNames, null, 2)

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `saints_names_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `Exported ${saints.length} saint names to JSON file`
    })
  }

  // Filter saints based on search
  const filteredSaints = saints.filter(saint => 
    saint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.name_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.period?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handler functions
  const handleViewSaint = (saint: Saint) => {
    setViewingSaint(saint)
  }

  const handleEditSaint = (saint: Saint) => {
    setEditingSaint(saint)
  }

  const handleCloseSaintView = () => {
    setViewingSaint(null)
  }

  useEffect(() => {
    fetchSaints()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saints Management</h1>
          <p className="text-gray-600 mt-1">Manage spiritual masters and their biographies</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={exportSaintsToCSV}
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
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Saint
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{saints.length}</div>
          <div className="text-sm text-gray-600">Total Saints</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {saints.filter(s => s.image_url).length}
          </div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {saints.filter(s => s.biography_hi).length}
          </div>
          <div className="text-sm text-gray-600">Hindi Content</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {filteredSaints.length}
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
            placeholder="Search saints by name, specialty, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        
        {selectedSaints.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={deleteSelectedSaints}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedSaints.length})
            </Button>
          </div>
        )}
      </div>

      {/* Saints Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed"
                 style={{ minWidth: '800px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSaints.length === filteredSaints.length && filteredSaints.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSaints(filteredSaints.map(s => s.id))
                      } else {
                        setSelectedSaints([])
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saint
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period & Region
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
              {filteredSaints.map((saint) => (
                <tr 
                  key={saint.id}
                  className={selectedSaints.includes(saint.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSaints.includes(saint.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSaints([...selectedSaints, saint.id])
                        } else {
                          setSelectedSaints(selectedSaints.filter(id => id !== saint.id))
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {saint.image_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={saint.image_url}
                            alt={saint.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${saint.name}&background=random`
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">{saint.name[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {saint.name}
                        </div>
                        {saint.name_hi && (
                          <div className="text-sm text-gray-500">
                            {saint.name_hi}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div>
                      {saint.specialty || 'Not specified'}
                    </div>
                    {saint.specialty_hi && (
                      <div className="text-xs text-gray-500">
                        {saint.specialty_hi}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div>{saint.period || 'Unknown period'}</div>
                    <div className="text-xs">{saint.region || 'Unknown region'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      {saint.image_url && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Has Image
                        </span>
                      )}
                      {saint.biography_hi && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Hindi Content
                        </span>
                      )}
                      {(!saint.description || !saint.biography) && (
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
                        onClick={() => handleViewSaint(saint)}
                        title="View saint details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSaint(saint)}
                        title="Edit saint"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(saint.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete saint"
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

        {filteredSaints.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchQuery ? 'No saints found matching your search.' : 'No saints added yet.'}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try different search terms.' : 'Click "Add Saint" to get started.'}
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
              <h3 className="text-lg font-medium text-gray-900">Delete Saint</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete 
                  <strong className="text-gray-700 mx-1">
                    {saints.find(s => s.id === deleteConfirm)?.name}
                  </strong>? 
                  This action cannot be undone and will remove the saint from your website.
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
                  onClick={() => deleteSaint(deleteConfirm)}
                >
                  Delete Saint
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Saint Modal */}
      <SaintViewModal
        saint={viewingSaint}
        isOpen={!!viewingSaint}
        onClose={handleCloseSaintView}
        onEdit={(saint) => {
          setViewingSaint(null)
          setEditingSaint(saint)
        }}
      />

      {/* Add/Edit Saint Form */}
      <SaintForm
        saint={editingSaint}
        isOpen={isAddModalOpen || !!editingSaint}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingSaint(null)
        }}
        onSave={() => {
          fetchSaints()
        }}
      />

      {/* Bulk Import Modal */}
      <BulkImport
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={fetchSaints}
        tableName="saints"
        tableDisplayName="Saints"
        sampleFormat={`[
  {
    "name": "Sant Tukaram",
    "name_hi": "संत तुकाराम",
    "period": "17th Century",
    "region": "Maharashtra",
    "image_url": "https://example.com/image.jpg",
    "description": "Great devotee of Lord Vitthala",
    "description_hi": "भगवान विट्ठल के महान भक्त",
    "specialty": "Devotional Poetry",
    "specialty_hi": "भक्ति काव्य",
    "biography": "Full biography here...",
    "biography_hi": "पूरी जीवनी यहाँ..."
  }
]`}
      />
    </div>
  )
}