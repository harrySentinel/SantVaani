import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import DivineFormForm from '@/components/DivineFormForm'
import DivineFormViewModal from '@/components/DivineFormViewModal'
import BulkImport from '@/components/BulkImport'

// Divine Form interface matching your actual database schema
interface DivineForm {
  id: string
  name: string
  name_hi: string | null
  domain: string | null
  domain_hi: string | null
  image_url: string | null
  description: string | null
  description_hi: string | null
  attributes: string[] | null
  mantra: string | null
  significance: string | null
  created_at: string
  updated_at: string | null
}

export default function DivineFormsPage() {
  const [divineForms, setDivineForms] = useState<DivineForm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<DivineForm | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewingForm, setViewingForm] = useState<DivineForm | null>(null)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  
  const { toast } = useToast()

  // Fetch all divine forms from database
  const fetchDivineForms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.DIVINE_FORMS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setDivineForms(data || [])
    } catch (error) {
      console.error('Error fetching divine forms:', error)
      toast({
        title: "Error",
        description: "Failed to load divine forms. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete divine form
  const deleteDivineForm = async (formId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.DIVINE_FORMS)
        .delete()
        .eq('id', formId)

      if (error) throw error

      setDivineForms(divineForms.filter(f => f.id !== formId))
      toast({
        title: "Success",
        description: "Divine form deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting divine form:', error)
      toast({
        title: "Error", 
        description: "Failed to delete divine form. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Delete multiple divine forms
  const deleteSelectedForms = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.DIVINE_FORMS)
        .delete()
        .in('id', selectedForms)

      if (error) throw error

      setDivineForms(divineForms.filter(f => !selectedForms.includes(f.id)))
      setSelectedForms([])
      toast({
        title: "Success",
        description: `${selectedForms.length} divine forms deleted successfully`
      })
    } catch (error) {
      console.error('Error deleting divine forms:', error)
      toast({
        title: "Error",
        description: "Failed to delete selected divine forms. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Filter divine forms based on search
  const filteredForms = divineForms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.name_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.domain_hi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.mantra?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (form.attributes && form.attributes.some(attr => 
      attr.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  )

  // Handler functions
  const handleViewForm = (form: DivineForm) => {
    setViewingForm(form)
  }

  const handleEditForm = (form: DivineForm) => {
    setEditingForm(form)
  }

  const handleCloseFormView = () => {
    setViewingForm(null)
  }

  useEffect(() => {
    fetchDivineForms()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading divine forms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Divine Forms Management</h1>
          <p className="text-gray-600 mt-1">Manage sacred manifestations and their descriptions</p>
        </div>
        <div className="flex space-x-3">
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
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Divine Form
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{divineForms.length}</div>
          <div className="text-sm text-gray-600">Total Divine Forms</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {divineForms.filter(f => f.image_url).length}
          </div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {divineForms.filter(f => f.description_hi).length}
          </div>
          <div className="text-sm text-gray-600">Hindi Content</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {filteredForms.length}
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
            placeholder="Search by name, domain, mantra, attributes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>
        
        {selectedForms.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={deleteSelectedForms}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedForms.length})
            </Button>
          </div>
        )}
      </div>

      {/* Divine Forms Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed"
                 style={{ minWidth: '900px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedForms.length === filteredForms.length && filteredForms.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedForms(filteredForms.map(f => f.id))
                      } else {
                        setSelectedForms([])
                      }
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Divine Form
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain & Attributes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mantra & Significance
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
              {filteredForms.map((form) => (
                <tr 
                  key={form.id}
                  className={selectedForms.includes(form.id) ? 'bg-purple-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedForms.includes(form.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedForms([...selectedForms, form.id])
                        } else {
                          setSelectedForms(selectedForms.filter(id => id !== form.id))
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {form.image_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={form.image_url}
                            alt={form.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${form.name}&background=7c3aed&color=fff`
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-purple-700 text-sm">{form.name[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {form.name}
                        </div>
                        {form.name_hi && (
                          <div className="text-sm text-gray-500">
                            {form.name_hi}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900">
                      {form.domain || 'Not specified'}
                    </div>
                    {form.attributes && form.attributes.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {form.attributes.slice(0, 3).join(', ')}
                        {form.attributes.length > 3 && '...'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900 truncate max-w-32">
                      {form.mantra || 'No mantra'}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-32">
                      {form.significance || 'No significance'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      {form.image_url && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Has Image
                        </span>
                      )}
                      {form.description_hi && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Hindi Content
                        </span>
                      )}
                      {form.mantra && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Has Mantra
                        </span>
                      )}
                      {(!form.description || !form.significance) && (
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
                        onClick={() => handleViewForm(form)}
                        title="View divine form details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditForm(form)}
                        title="Edit divine form"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(form.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete divine form"
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

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchQuery ? 'No divine forms found matching your search.' : 'No divine forms added yet.'}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try different search terms.' : 'Click "Add Divine Form" to get started.'}
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
              <h3 className="text-lg font-medium text-gray-900">Delete Divine Form</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete 
                  <strong className="text-gray-700 mx-1">
                    {divineForms.find(f => f.id === deleteConfirm)?.name}
                  </strong>? 
                  This action cannot be undone and will remove the divine form from your website.
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
                  onClick={() => deleteDivineForm(deleteConfirm)}
                >
                  Delete Divine Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Divine Form Modal */}
      <DivineFormViewModal
        divineForm={viewingForm}
        isOpen={!!viewingForm}
        onClose={handleCloseFormView}
        onEdit={(form) => {
          setViewingForm(null)
          setEditingForm(form)
        }}
      />

      {/* Add/Edit Divine Form */}
      <DivineFormForm
        divineForm={editingForm}
        isOpen={isAddModalOpen || !!editingForm}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingForm(null)
        }}
        onSave={() => {
          fetchDivineForms()
        }}
      />

      {/* Bulk Import Modal */}
      <BulkImport
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={fetchDivineForms}
        tableName="divine_forms"
        tableDisplayName="Divine Forms"
        sampleFormat={`[
  {
    "name": "Lord Ganesha",
    "name_hi": "भगवान गणेश",
    "domain": "Remover of Obstacles",
    "domain_hi": "विघ्न हर्ता",
    "image_url": "https://example.com/ganesha.jpg",
    "description": "The elephant-headed deity who removes obstacles and brings wisdom",
    "description_hi": "गज मुख देवता जो बाधाओं को दूर करते हैं और ज्ञान लाते हैं",
    "attributes": ["Elephant head", "Four arms", "Modaka", "Wisdom"],
    "mantra": "ॐ गं गणपतये नमः",
    "significance": "Lord of beginnings and remover of obstacles"
  }
]`}
      />
    </div>
  )
}