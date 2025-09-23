import { supabase } from './supabaseClient';

// Event types
export interface EventFormData {
  title: string;
  description: string;
  type: string;
  otherEventDetails: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  organizerName: string;
  organizerPhone: string;
  organizerEmail: string;
  exactLocation: string;
  invitationMessage: string;
  additionalNotes: string;
}

export interface Event {
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
  user_id: string;
  admin_feedback?: string;
  created_at: string;
  updated_at: string;
}

export const eventsService = {
  // Create new event (submit for approval)
  async createEvent(eventData: EventFormData, userId: string): Promise<Event> {
    const eventPayload = {
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      date: eventData.date,
      time: `${eventData.startTime} - ${eventData.endTime}`,
      location: eventData.location,
      city: eventData.address,
      organizer: eventData.organizerName,
      organizer_phone: eventData.organizerPhone,
      organizer_email: eventData.organizerEmail,
      invitation_message: eventData.invitationMessage,
      status: 'pending',
      user_id: userId,
      exact_location: eventData.exactLocation,
      additional_notes: eventData.additionalNotes
    };

    console.log('Creating event with payload:', eventPayload);

    const { data, error } = await supabase
      .from('events')
      .insert([eventPayload])
      .select()
      .single();

    console.log('Insert result:', { data, error });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get all approved events (public)
  async getApprovedEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  // Get user's events with all statuses
  async getUserEvents(userId: string): Promise<Event[]> {
    console.log('Querying events for user_id:', userId);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('Query result:', { data, error });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  // Get all events for admin (all statuses)
  async getAllEventsForAdmin(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  // Get pending events for admin review
  async getPendingEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  // Admin approve event
  async approveEvent(eventId: string, adminFeedback?: string): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'approved',
        admin_feedback: adminFeedback,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Admin reject event
  async rejectEvent(eventId: string, adminFeedback: string): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'rejected',
        admin_feedback: adminFeedback,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get event by ID
  async getEventById(eventId: string): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};

export default eventsService;