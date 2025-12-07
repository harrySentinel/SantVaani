import { useState, useEffect } from 'react'
import { Search, CheckCircle, XCircle, Eye, Edit, Trash2, Building2, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

interface Organization {
  id: string
  organization_name: string
  organization_name_hi?: string
  organization_type: string
  contact_person: string
  phone: string
  email: string
  city: string
  state: string
  address?: string
  pincode?: string
  description?: string
  description_hi?: string
  established_year?: number
  capacity?: number
  needs?: string[]
  upi_id?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  created_at: string
  updated_at: string
  reviewed_at?: string
}

const organizationTypeLabels: Record<string, string> = {
  vridh_ashram: 'Vridh Ashram',
  orphanage: 'Orphanage',
  dharamshala: 'Dharamshala',
  temple: 'Temple',
  gaushala: 'Gaushala',
  other: 'Other'
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [viewingOrg, setViewingOrg] = useState<Organization | null>(null)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { toast } = useToast()

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('organization_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error

      setOrganizations(data || [])
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast({
        title: "Error",
        description: "Failed to load organizations. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [statusFilter])

  // Approve organization
  const approveOrganization = async (org: Organization) => {
    try {
      const { error } = await supabase
        .from('organization_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', org.id)

      if (error) throw error

      fetchOrganizations()
      toast({
        title: "Success",
        description: `${org.organization_name} has been approved!`
      })
    } catch (error) {
      console.error('Error approving organization:', error)
      toast({
        title: "Error",
        description: "Failed to approve organization. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Reject organization
  const rejectOrganization = async (org: Organization, reason?: string) => {
    try {
      const { error } = await supabase
        .from('organization_submissions')
        .update({
          status: 'rejected',
          admin_notes: reason,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', org.id)

      if (error) throw error

      fetchOrganizations()
      toast({
        title: "Success",
        description: `${org.organization_name} has been rejected`
      })
    } catch (error) {
      console.error('Error rejecting organization:', error)
      toast({
        title: "Error",
        description: "Failed to reject organization. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Delete organization
  const deleteOrganization = async (orgId: string) => {
    try {
      const { error } = await supabase
        .from('organization_submissions')
        .delete()
        .eq('id', orgId)

      if (error) throw error

      fetchOrganizations()
      toast({
        title: "Success",
        description: "Organization deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting organization:', error)
      toast({
        title: "Error",
        description: "Failed to delete organization. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Filter organizations by search
  const filteredOrganizations = organizations.filter(org =>
    org.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingCount = organizations.filter(o => o.status === 'pending').length
  const approvedCount = organizations.filter(o => o.status === 'approved').length
  const rejectedCount = organizations.filter(o => o.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Submissions</h1>
          <p className="text-gray-600 mt-1">Review and manage organization submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{organizations.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Pending</p>
              <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
            </div>
            <Building2 className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            className={statusFilter === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('rejected')}
            className={statusFilter === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Organizations List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No organizations found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{org.organization_name}</div>
                        <div className="text-sm text-gray-500">{org.contact_person}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {organizationTypeLabels[org.organization_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {org.city}, {org.state}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {org.phone}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {org.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {org.status === 'pending' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        Pending
                      </span>
                    )}
                    {org.status === 'approved' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    )}
                    {org.status === 'rejected' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(org.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingOrg(org)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {org.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => approveOrganization(org)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rejectOrganization(org)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(org.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewingOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{viewingOrg.organization_name}</h2>
                <button
                  onClick={() => setViewingOrg(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Organization Details</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{organizationTypeLabels[viewingOrg.organization_type]}</p>
                    </div>
                    {viewingOrg.established_year && (
                      <div>
                        <p className="text-sm text-gray-500">Established</p>
                        <p className="font-medium">{viewingOrg.established_year}</p>
                      </div>
                    )}
                    {viewingOrg.capacity && (
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">{viewingOrg.capacity} residents</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Contact Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-gray-500">Contact Person:</span> {viewingOrg.contact_person}</p>
                    <p><span className="text-gray-500">Phone:</span> {viewingOrg.phone}</p>
                    <p><span className="text-gray-500">Email:</span> {viewingOrg.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <div className="mt-2">
                    {viewingOrg.address && <p>{viewingOrg.address}</p>}
                    <p>{viewingOrg.city}, {viewingOrg.state}</p>
                    {viewingOrg.pincode && <p>PIN: {viewingOrg.pincode}</p>}
                  </div>
                </div>

                {viewingOrg.description && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Description</h3>
                    <p className="mt-2 text-gray-600">{viewingOrg.description}</p>
                  </div>
                )}

                {viewingOrg.needs && viewingOrg.needs.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Current Needs</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {viewingOrg.needs.map((need, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${viewingOrg.status === 'approved' ? 'text-green-600' : viewingOrg.status === 'rejected' ? 'text-red-600' : 'text-orange-600'}`}>
                      {viewingOrg.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {formatDate(viewingOrg.created_at)}
                  </p>
                </div>

                {viewingOrg.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        approveOrganization(viewingOrg)
                        setViewingOrg(null)
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        rejectOrganization(viewingOrg)
                        setViewingOrg(null)
                      }}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this organization? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => deleteOrganization(deleteConfirm)}
                variant="destructive"
                className="flex-1"
              >
                Delete
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
