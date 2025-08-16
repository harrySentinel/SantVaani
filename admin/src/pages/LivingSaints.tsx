import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import LivingSaintForm from '@/components/LivingSaintForm'
import LivingSaintViewModal from '@/components/LivingSaintViewModal'

// Living Saint interface matching your database schema
interface LivingSaint {
  id: string
  name: string
  name_hi: string | null
  organization: string | null
  specialty: string | null
  specialty_hi: string | null
  image: string | null
  description: string | null
  description_hi: string | null
  website: string | null
  followers: string | null
  teachings: string[] | null
  birth_place: string | null
  birth_place_hi: string | null
  current_location: string | null
  current_location_hi: string | null
  biography: string | null
  biography_hi: string | null
  spiritual_journey: string | null
  spiritual_journey_hi: string | null
  key_teachings: string[] | null
  key_teachings_hi: string[] | null
  quotes: string[] | null
  quotes_hi: string[] | null
  ashram: string | null
  ashram_hi: string | null
  lineage: string | null
  lineage_hi: string | null
  created_at: string
  updated_at: string | null
}

export default function LivingSaintsPage() {
  const [saints, setSaints] = useState<LivingSaint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSaints, setSelectedSaints] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSaint, setEditingSaint] = useState<LivingSaint | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewingSaint, setViewingSaint] = useState<LivingSaint | null>(null)
  
  const { toast } = useToast()

  // Fetch all living saints from database
  const fetchSaints = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.LIVING_SAINTS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSaints(data || [])
    } catch (error) {
      console.error('Error fetching living saints:', error)
      toast({
        title: "Error",
        description: "Failed to load living saints. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete living saint
  const deleteSaint = async (saintId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.LIVING_SAINTS)
        .delete()
        .eq('id', saintId)

      if (error) throw error

      setSaints(saints.filter(s => s.id !== saintId))
      toast({
        title: "Success",
        description: "Living saint deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting living saint:', error)
      toast({
        title: "Error", 
        description: "Failed to delete living saint. Please try again.",
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
        .from(TABLES.LIVING_SAINTS)
        .delete()
        .in('id', selectedSaints)

      if (error) throw error

      setSaints(saints.filter(s => !selectedSaints.includes(s.id)))
      setSelectedSaints([])
      toast({
        title: "Success",
        description: `${selectedSaints.length} living saints deleted successfully`
      })
    } catch (error) {
      console.error('Error deleting living saints:', error)
      toast({
        title: "Error",
        description: "Failed to delete selected living saints. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Export living saints list to JSON
  const exportLivingSaintsToJSON = () => {
    const saintNames = saints.map(saint => saint.name)
    const jsonContent = JSON.stringify(saintNames, null, 2)

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `living_saints_names_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `Exported ${saints.length} living saint names to JSON file`
    })
  }

  // Filter saints based on search
  const filteredSaints = saints.filter(saint => 
    saint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.name_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.current_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.ashram?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handler functions
  const handleViewSaint = (saint: LivingSaint) => {
    setViewingSaint(saint)
  }

  const handleEditSaint = (saint: LivingSaint) => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading living saints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Living Saints Management</h1>
          <p className="text-gray-600 mt-1">Manage contemporary spiritual masters</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={exportLivingSaintsToJSON}
            variant="outline"
            className="w-full sm:w-auto text-green-600 border-green-200 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Living Saint
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{saints.length}</div>
          <div className="text-sm text-gray-600">Total Living Saints</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {saints.filter(s => s.image).length}
          </div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {saints.filter(s => s.description_hi).length}
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
            placeholder="Search by name, organization, location, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
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

      {/* Living Saints Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed"
                 style={{ minWidth: '900px' }}>
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
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Living Saint
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Specialty
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
                  className={selectedSaints.includes(saint.id) ? 'bg-red-50' : 'hover:bg-gray-50'}
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
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {saint.image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={saint.image}
                            alt={saint.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${saint.name}&background=dc2626&color=fff`
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center">
                            <span className="text-red-700 text-sm">{saint.name[0]}</span>
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
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900">
                      {saint.organization || 'Not specified'}
                    </div>
                    {saint.followers && (
                      <div className="text-xs text-gray-500">
                        {saint.followers} followers
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900">
                      {saint.current_location || 'Unknown location'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {saint.specialty || 'No specialty listed'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      {saint.image && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Has Image
                        </span>
                      )}
                      {saint.description_hi && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Hindi Content
                        </span>
                      )}
                      {saint.website && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Has Website
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
                        title="View living saint details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSaint(saint)}
                        title="Edit living saint"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(saint.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete living saint"
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
              {searchQuery ? 'No living saints found matching your search.' : 'No living saints added yet.'}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try different search terms.' : 'Click "Add Living Saint" to get started.'}
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
              <h3 className="text-lg font-medium text-gray-900">Delete Living Saint</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete 
                  <strong className="text-gray-700 mx-1">
                    {saints.find(s => s.id === deleteConfirm)?.name}
                  </strong>? 
                  This action cannot be undone and will remove the living saint from your website.
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
                  Delete Living Saint
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Living Saint Modal */}
      <LivingSaintViewModal
        saint={viewingSaint}
        isOpen={!!viewingSaint}
        onClose={handleCloseSaintView}
        onEdit={(saint) => {
          setViewingSaint(null)
          setEditingSaint(saint)
        }}
      />

      {/* Add/Edit Living Saint Form */}
      <LivingSaintForm
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
    </div>
  )
}