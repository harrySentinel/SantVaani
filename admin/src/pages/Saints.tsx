import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Upload, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate, truncateText } from '@/lib/utils'
import SaintForm from '@/components/SaintForm'
import SaintViewModal from '@/components/SaintViewModal'
import BulkImport from '@/components/BulkImport'
import {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
  MobileCardActions
} from '@/components/ui/responsive-table'
import EmptyState from '@/components/ui/empty-state'
import LoadingScreen from '@/components/ui/loading-screen'
import FloatingActionButton from '@/components/ui/floating-action-button'

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
    return <LoadingScreen message="Loading saints..." />
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-6 sm:mb-0">
          <h1 className="desktop-heading text-gradient">Saints Management</h1>
          <p className="text-gray-600 mt-2 font-medium desktop-subheading">Manage spiritual masters and their biographies</p>
        </div>
        <div className="desktop-button-group">
          <Button
            onClick={exportSaintsToCSV}
            variant="outline"
            className="w-full sm:w-auto text-green-600 border-green-200 hover:bg-green-50 btn-enhanced hover-lift"
          >
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button
            onClick={() => setIsBulkImportOpen(true)}
            variant="outline"
            className="w-full sm:w-auto btn-enhanced hover-lift"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary-enhanced w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Saint
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="desktop-cards-grid">
        <div className="stats-card">
          <div className="text-2xl font-bold text-blue-600">{saints.length}</div>
          <div className="text-sm text-gray-600">Total Saints</div>
        </div>
        <div className="stats-card">
          <div className="text-2xl font-bold text-green-600">
            {saints.filter(s => s.image_url).length}
          </div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
        <div className="stats-card">
          <div className="text-2xl font-bold text-purple-600">
            {saints.filter(s => s.biography_hi).length}
          </div>
          <div className="text-sm text-gray-600">Hindi Content</div>
        </div>
        <div className="stats-card">
          <div className="text-2xl font-bold text-orange-600">
            {filteredSaints.length}
          </div>
          <div className="text-sm text-gray-600">Search Results</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 min-w-0 search-enhanced">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <input
            type="text"
            placeholder="Search saints by name, specialty, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none text-sm input-enhanced"
          />
        </div>
        
        {selectedSaints.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={deleteSelectedSaints}
              className="shrink-0 btn-danger-enhanced hover-lift"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedSaints.length})
            </Button>
          </div>
        )}
      </div>

      {/* Saints Table */}
      <ResponsiveTable>
        <ResponsiveTableHeader>
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
        </ResponsiveTableHeader>

        <ResponsiveTableBody>
          {filteredSaints.map((saint) => (
            <ResponsiveTableRow
              key={saint.id}
              className={selectedSaints.includes(saint.id) ? 'bg-blue-50' : ''}
              mobileCard={
                <div className="p-4 space-y-3 border-b border-gray-200 last:border-b-0">
                  {/* Mobile card header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
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
                      <div className="flex-shrink-0">
                        {saint.image_url ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={saint.image_url}
                            alt={saint.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${saint.name}&background=random`
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-lg font-medium">{saint.name[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{saint.name}</h3>
                        {saint.name_hi && (
                          <p className="text-sm text-gray-500 truncate">{saint.name_hi}</p>
                        )}
                      </div>
                    </div>
                    <MobileCardActions
                      actions={[
                        { label: 'View', onClick: () => handleViewSaint(saint) },
                        { label: 'Edit', onClick: () => handleEditSaint(saint) },
                        { label: 'Delete', onClick: () => setDeleteConfirm(saint.id), variant: 'destructive' }
                      ]}
                    />
                  </div>

                  {/* Mobile card details */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Specialty:</span>
                      <p className="text-sm text-gray-900">{saint.specialty || 'Not specified'}</p>
                      {saint.specialty_hi && (
                        <p className="text-xs text-gray-500">{saint.specialty_hi}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Period:</span>
                        <p className="text-sm text-gray-900">{saint.period || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Region:</span>
                        <p className="text-sm text-gray-900">{saint.region || 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-1">
                      {saint.image_url && (
                        <span className="badge-enhanced badge-success">
                          Has Image
                        </span>
                      )}
                      {saint.biography_hi && (
                        <span className="badge-enhanced badge-info">
                          Hindi Content
                        </span>
                      )}
                      {(!saint.description || !saint.biography) && (
                        <span className="badge-enhanced badge-warning">
                          Incomplete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              }
            >
              <ResponsiveTableCell>
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
              </ResponsiveTableCell>

              <ResponsiveTableCell>
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
                    <div className="text-sm font-medium text-gray-900">{saint.name}</div>
                    {saint.name_hi && (
                      <div className="text-sm text-gray-500">{saint.name_hi}</div>
                    )}
                  </div>
                </div>
              </ResponsiveTableCell>

              <ResponsiveTableCell hideOnMobile>
                <div>
                  {saint.specialty || 'Not specified'}
                </div>
                {saint.specialty_hi && (
                  <div className="text-xs text-gray-500">{saint.specialty_hi}</div>
                )}
              </ResponsiveTableCell>

              <ResponsiveTableCell hideOnMobile>
                <div>{saint.period || 'Unknown period'}</div>
                <div className="text-xs">{saint.region || 'Unknown region'}</div>
              </ResponsiveTableCell>

              <ResponsiveTableCell hideOnMobile>
                <div className="flex flex-col space-y-1">
                  {saint.image_url && (
                    <span className="badge-enhanced badge-success">
                      Has Image
                    </span>
                  )}
                  {saint.biography_hi && (
                    <span className="badge-enhanced badge-info">
                      Hindi Content
                    </span>
                  )}
                  {(!saint.description || !saint.biography) && (
                    <span className="badge-enhanced badge-warning">
                      Incomplete
                    </span>
                  )}
                </div>
              </ResponsiveTableCell>

              <ResponsiveTableCell hideOnMobile>
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
              </ResponsiveTableCell>
            </ResponsiveTableRow>
          ))}
        </ResponsiveTableBody>

        {filteredSaints.length === 0 && (
          <EmptyState
            icon="🙏"
            title={searchQuery ? 'No saints found' : 'No saints added yet'}
            description={searchQuery ? 'Try different search terms to find what you\'re looking for.' : 'Start building your spiritual content by adding the first saint to your collection.'}
            actionLabel={searchQuery ? undefined : 'Add First Saint'}
            onAction={searchQuery ? undefined : () => setIsAddModalOpen(true)}
            className="py-20"
          />
        )}
      </ResponsiveTable>

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

      {/* Mobile Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsAddModalOpen(true)}
        ariaLabel="Add new saint"
      />
    </div>
  )
}