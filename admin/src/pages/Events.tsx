import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Eye, MessageSquare, Clock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import EventForm from '@/components/EventForm';

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  city: string;
  organizer: string;
  organizer_phone: string;
  organizer_email: string;
  invitation_message: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_feedback?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadEvents();
  }, [filterStatus]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('Admin: Loading events with filter:', filterStatus);

      // First, let's test if we can see ANY table data at all
      const { data: testData, error: testError } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true });

      console.log('Admin: Total events count in database:', testData, testError);

      let query = supabase.from('events').select('*').order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      console.log('Admin: Query result data:', data);
      console.log('Admin: Query result error:', error);
      console.log('Admin: Events count:', data?.length);

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedEvent) return;

    try {
      setProcessingAction(true);

      console.log('Admin: Attempting to update event:', selectedEvent.id, 'to status:', actionType);

      const updateData = {
        status: actionType === 'approve' ? 'approved' : 'rejected',
        admin_feedback: adminFeedback,
        updated_at: new Date().toISOString()
      };

      console.log('Admin: Update data:', updateData);

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', selectedEvent.id)
        .select();

      console.log('Admin: Update result:', { data, error });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Event ${actionType}d successfully`,
      });

      setIsActionModalOpen(false);
      setAdminFeedback('');
      loadEvents();

    } catch (error: any) {
      console.error('Error updating event:', error);
      console.error('Error details:', error.message, error.details);
      toast({
        title: "Error",
        description: `Failed to ${actionType} event: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const openActionModal = (event: Event, action: 'approve' | 'reject') => {
    setSelectedEvent(event);
    setActionType(action);
    setAdminFeedback('');
    setIsActionModalOpen(true);
  };

  const openDetailModal = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEvent(null);
    setIsEditModalOpen(false);
  };

  const handleEventSaved = () => {
    loadEvents(); // Reload the events list
    closeEditModal();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-2">Review and manage community event submissions</p>
        </div>
        <Button onClick={loadEvents} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events found for the selected filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
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
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.description}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {event.type} • {event.location}, {event.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{event.organizer}</div>
                      <div className="text-sm text-gray-500">{event.organizer_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{event.date}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(event.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailModal(event)}
                        className="btn-enhanced hover-lift"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>

                      {event.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(event)}
                            className="text-blue-600 hover:text-blue-700 btn-enhanced hover-lift"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActionModal(event, 'approve')}
                            className="text-green-600 hover:text-green-700 btn-enhanced hover-lift"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActionModal(event, 'reject')}
                            className="text-red-600 hover:text-red-700 btn-enhanced hover-lift"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Type</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.type}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm text-gray-900">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Time</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">City</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Organizer</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.organizer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.organizer_phone}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-sm text-gray-900">{selectedEvent.organizer_email}</p>
              </div>

              {selectedEvent.invitation_message && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Invitation Message</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedEvent.invitation_message}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Submitted</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedEvent.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedEvent.admin_feedback && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Admin Feedback</Label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md">
                    {selectedEvent.admin_feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Event' : 'Reject Event'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {actionType === 'approve'
                ? 'Are you sure you want to approve this event? It will be visible to all users.'
                : 'Please provide a reason for rejecting this event.'
              }
            </p>

            <div>
              <Label htmlFor="feedback">
                {actionType === 'approve' ? 'Approval Message (Optional)' : 'Rejection Reason (Required)'}
              </Label>
              <Textarea
                id="feedback"
                value={adminFeedback}
                onChange={(e) => setAdminFeedback(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Great event! Looking forward to community participation.'
                    : 'Please provide more details about venue capacity and safety arrangements.'
                }
                className="mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsActionModalOpen(false)}
                disabled={processingAction}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={processingAction || (actionType === 'reject' && !adminFeedback.trim())}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {processingAction ? 'Processing...' : `${actionType === 'approve' ? 'Approve' : 'Reject'} Event`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Edit Modal */}
      <EventForm
        event={selectedEvent}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleEventSaved}
      />
    </div>
  );
};

export default Events;