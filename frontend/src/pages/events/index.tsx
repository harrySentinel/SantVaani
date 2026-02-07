import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, Plus, Bell, X, User, Phone, Mail, BellRing, CheckCircle, Shield, Sparkles, Wand2, RefreshCw, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { eventsService } from '@/lib/events';
import { getFCMToken } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import EventShareButton from '@/components/EventShareButton';

const Events = () => {
  const { t, language } = useLanguage();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [subscribedEvents, setSubscribedEvents] = useState(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    otherEventDetails: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    organizerName: '',
    organizerPhone: '',
    organizerEmail: '',
    exactLocation: '',
    invitationMessage: '',
    additionalNotes: ''
  });

  // Load approved events on component mount
  useEffect(() => {
    loadApprovedEvents();
  }, []);

  // Load user's subscribed events when user changes or component mounts
  useEffect(() => {
    if (user) {
      const userSubscriptions = JSON.parse(localStorage.getItem(`event_subscriptions_${user.id}`) || '[]');
      setSubscribedEvents(new Set(userSubscriptions));
    } else {
      // Clear subscriptions when user logs out
      setSubscribedEvents(new Set());
    }
  }, [user]);

  // Auto-populate organizer details when form opens and user is logged in
  useEffect(() => {
    if (isCreateFormOpen && user && !formData.organizerName && !formData.organizerEmail) {
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || '';
      const userEmail = user.email || '';
      const userPhone = user.user_metadata?.phone || '';

      setFormData(prev => ({
        ...prev,
        organizerName: userName,
        organizerEmail: userEmail,
        organizerPhone: userPhone
      }));

      if (userName || userEmail) {
        toast({
          title: "✅ Details Auto-filled",
          description: "Your name and email have been automatically filled from your profile",
          duration: 3000,
        });
      }
    }
  }, [isCreateFormOpen, user]);

  const loadApprovedEvents = async () => {
    try {
      setLoadingEvents(true);
      console.log('Loading approved events...');
      const events = await eventsService.getApprovedEvents();
      console.log('Loaded approved events:', events);
      setApprovedEvents(events);
    } catch (error) {
      console.error('Error loading approved events:', error);
      toast({
        title: "⚠️ Error Loading Events",
        description: "Failed to load events. Showing sample events instead.",
        duration: 4000,
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  // AI Functions for Invitation Messages
  const generateAIInvitation = async () => {
    if (!formData.type || !formData.date || !formData.startTime || !formData.title) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in Event Type, Title, Date, and Start Time to generate AI invitation",
        duration: 3000,
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      // Simulate AI generation for now - we'll replace this with real AI later
      const eventContext = {
        type: formData.type,
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location
      };

      const suggestions = generateMockAIInvitations(eventContext);
      setAiSuggestions(suggestions);

      toast({
        title: "✨ AI Invitations Generated!",
        description: "Choose from the suggestions below or edit them as needed",
        duration: 4000,
      });
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "⚠️ AI Generation Failed",
        description: "Please try again or write manually",
        duration: 3000,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const enhanceUserMessage = async () => {
    if (!formData.invitationMessage.trim()) {
      toast({
        title: "⚠️ No Message to Enhance",
        description: "Please write a message first, then click enhance",
        duration: 3000,
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      // Simulate AI enhancement for now
      const enhancedMessage = enhanceMockMessage(formData.invitationMessage, formData.type);
      setAiSuggestions([enhancedMessage]);

      toast({
        title: "✨ Message Enhanced!",
        description: "Your message has been enhanced with AI",
        duration: 4000,
      });
    } catch (error) {
      console.error('AI enhancement error:', error);
      toast({
        title: "⚠️ Enhancement Failed",
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Mock AI functions (we'll replace with real AI later)
  const generateMockAIInvitations = (context) => {
    const { type, title, date, startTime, endTime, location } = context;

    const templates = {
      'bhagwad-katha': [
        `🙏 आप सभी भक्तजनों को हार्दिक निमंत्रण 🙏\n\n${new Date(date).toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} को ${startTime} बजे से "${title}" का शुभारंभ हो रहा है।\n\nश्री कृष्ण की दिव्य लीलाओं का श्रवण करें और जीवन को धन्य बनाएं। गीता के अमृत वचनों से अपने हृदय को पवित्र करें।\n\nस्थान: ${location || 'स्थान शीघ्र घोषित'}\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\n\nप्रसाद सहित सभी व्यवस्था निःशुल्क। परिवार सहित पधारें।\n\nहरे कृष्ण! 🪔✨`,

        `🕉️ श्रीमद भागवत कथा में आपका स्वागत है 🕉️\n\n"${title}" के पावन अवसर पर आप सभी श्रद्धालुओं को सादर आमंत्रित करते हैं।\n\nदिनांक: ${new Date(date).toLocaleDateString('hi-IN')}\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\nस्थान: ${location || 'स्थान की जानकारी शीघ्र'}\n\nभगवान श्री कृष्ण की कृपा से इस आध्यात्मिक यात्रा में सम्मिलित हों। प्रसाद एवं आवास की निःशुल्क व्यवस्था।\n\nआपकी उपस्थिति से कार्यक्रम सफल बनाएं। 🙏`
      ],

      'bhandara': [
        `🙏 माता रानी के भंडारे में आपका स्वागत है 🙏\n\n${new Date(date).toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })} को "${title}" का आयोजन हो रहा है।\n\nमाता की कृपा से सभी भक्तजनों को भंडारे में सादर आमंत्रित करते हैं। पूरी-सब्जी, खीर और प्रसाद का आनंद लें।\n\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\nस्थान: ${location || 'स्थान की जानकारी शीघ्र'}\n\nसभी भक्तजन अपने परिवार के साथ पधारें। माता की जय! 🚩🙏`,

        `🌺 माता के आशीर्वाद से भंडारा 🌺\n\n"${title}" में आप सभी का हार्दिक स्वागत है।\n\nदिनांक: ${new Date(date).toLocaleDateString('hi-IN')}\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\n\nमाता रानी की कृपा से निःशुल्क भोजन एवं प्रसाद वितरण। सभी श्रद्धालु परिवार सहित पधारें।\n\nजय माता दी! 🕉️✨`
      ],

      'kirtan': [
        `🎵 संकीर्तन में आपका स्वागत है 🎵\n\n"${title}" के पावन अवसर पर भजन-कीर्तन का आयोजन।\n\nदिनांक: ${new Date(date).toLocaleDateString('hi-IN')}\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\nस्थान: ${location || 'स्थान शीघ्र घोषित'}\n\nभगवान के नाम के संकीर्तन में सम्मिलित हों। आध्यात्मिक चर्चा एवं प्रसाद वितरण।\n\nसभी भक्तगण परिवार सहित पधारें। हरे कृष्ण! 🪔🙏`,

        `🎶 दिव्य संगीत की शाम 🎶\n\n"${title}" में भाग लेने के लिए आप सभी को आमंत्रित करते हैं।\n\nभजन-कीर्तन, आध्यात्मिक चर्चा और प्रसाद का कार्यक्रम।\n\nदिनांक: ${new Date(date).toLocaleDateString('hi-IN')}\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\n\nराधा कृष्ण के दिव्य प्रेम में डूबकर आनंद की अनुभूति करें। 🕉️✨`
      ]
    };

    return templates[type] || [
      `🙏 "${title}" में आपका स्वागत है 🙏\n\nदिनांक: ${new Date(date).toLocaleDateString('hi-IN')}\nसमय: ${startTime}${endTime ? ` से ${endTime}` : ''}\nस्थान: ${location || 'स्थान की जानकारी शीघ्र'}\n\nआप सभी का हार्दिक स्वागत है। कृपया परिवार सहित पधारें।\n\nधन्यवाद! 🙏`
    ];
  };

  const enhanceMockMessage = (message, eventType) => {
    // Convert English/Hinglish to pure Hindi with cultural enhancement
    const cleanMessage = message.toLowerCase().trim();

    // Translation mapping for common phrases
    const translations = {
      'i am inviting you': 'आप सभी को हार्दिक निमंत्रण है',
      'you are invited': 'आपको सादर आमंत्रित करते हैं',
      'bhagwad katha': 'श्रीमद भागवत कथा',
      'organizing by me': 'द्वारा आयोजित',
      'kirtan': 'कीर्तन',
      'bhandara': 'भंडारा',
      'satsang': 'सत्संग',
      'please come': 'कृपया पधारें',
      'everyone is welcome': 'सभी का स्वागत है',
      'with family': 'परिवार सहित',
      'free food': 'निःशुल्क प्रसाद',
      'prasad': 'प्रसाद'
    };

    // Enhanced templates based on event type
    const enhancedTemplates = {
      'bhagwad-katha': [
        `🕉️ श्रीमद भागवत कथा में आप सभी को हार्दिक निमंत्रण है 🕉️\n\nभगवान श्री कृष्ण की दिव्य लीलाओं का श्रवण करें और अपने जीवन को धन्य बनाएं। सप्त दिवसीय कथा में सभी भक्तजन परिवार सहित पधारें।\n\nगीता के ज्ञान से मन को शांति मिले और भक्ति का रस प्राप्त हो।\n\nप्रसाद सहित सभी व्यवस्था निःशुल्क। जय श्री कृष्ण! 🙏✨`,

        `📿 श्रीमद भागवत महापुराण की कथा 📿\n\nआप सभी श्रद्धालुओं को इस पावन अवसर पर सादर आमंत्रित करते हैं। भगवान के चरित्र सुनकर मन में भक्ति भाव जगाएं।\n\nसाधु संतों के सत्संग में बैठकर जीवन की सच्चाई को समझें। परमात्मा के नाम का जप करें और मोक्ष का मार्ग पाएं।\n\nसभी व्यवस्था निःशुल्क। हरि ॐ! 🕉️🌺`
      ],
      'kirtan': [
        `🎵 दिव्य कीर्तन संध्या में आपका स्वागत है 🎵\n\nराधा कृष्ण के भजन-कीर्तन में भाग लेकर मन को आनंद से भर दें। संगीत की मधुर धुन में भगवान के नाम का रस लें।\n\nभक्तों के साथ मिलकर हरि नाम संकीर्तन करें और दिव्य आनंद की अनुभूति करें।\n\nप्रसाद वितरण सहित। राधे राधे! 🎶🙏`,

        `🪔 संकीर्तन एवं सत्संग 🪔\n\nभगवान के नाम की महिमा सुनने और गाने के लिए सभी को आमंत्रित करते हैं। पवित्र वातावरण में बैठकर आत्मा की शुद्धता पाएं।\n\nहरिनाम के जप से जीवन में शांति और प्रेम का संचार होगा।\n\nसभी भक्तजन उत्साह से पधारें। जय गोविंद! 🌸✨`
      ],
      'bhandara': [
        `🙏 माता के भंडारे में सादर निमंत्रण 🙏\n\nदेवी माँ की कृपा से आयोजित इस पवित्र भंडारे में सभी श्रद्धालु परिवार सहित पधारें। माता की भक्ति में डूबकर पुण्य कमाएं।\n\nपूरी-सब्जी, खीर और प्रसाद का आनंद लें। माँ का आशीर्वाद पाकर जीवन को धन्य बनाएं।\n\nसेवा-भाव से सभी का स्वागत। जय माता दी! 🙏🌺`,

        `🕯️ निःशुल्क प्रसाद वितरण 🕯️\n\nभगवान की कृपा से आयोजित इस सामुदायिक भोज में सभी भाई-बहन आमंत्रित हैं। एक साथ बैठकर भोजन करने से प्रेम और एकता बढ़ती है।\n\nसादा भोजन और मिठास के साथ आत्मिक संतुष्टि पाएं।\n\nसभी का हार्दिक स्वागत है! 🙏🍃`
      ]
    };

    // Get event-specific enhanced version
    const templates = enhancedTemplates[eventType] || enhancedTemplates['bhagwad-katha'];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    return randomTemplate;
  };

  const selectAISuggestion = (suggestion) => {
    handleInputChange('invitationMessage', suggestion);
    setAiSuggestions([]);
    toast({
      title: "✅ Invitation Selected",
      description: "AI suggestion has been applied. You can edit it further if needed.",
      duration: 3000,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEventClick = () => {
    if (!user) {
      toast({
        title: "⚠️ Login Required",
        description: "Please login to create an event. You'll be redirected to the login page.",
        duration: 3000,
      });
      navigate('/login');
      return;
    }
    setIsCreateFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "⚠️ Authentication Required",
        description: "Please login to submit an event",
        duration: 3000,
      });
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.date || !formData.startTime || !formData.location) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in all required fields",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Event submission:', formData);
      console.log('Submitting for user ID:', user.id);

      const newEvent = await eventsService.createEvent(formData, user.id);
      console.log('Event created:', newEvent);

      toast({
        title: "✅ Event Submitted Successfully!",
        description: "Your event has been submitted for admin approval. You can track its status in your dashboard.",
        duration: 5000,
      });

      setIsCreateFormOpen(false);

      // Reload approved events in case admin approves it quickly
      loadApprovedEvents();

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        otherEventDetails: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        address: '',
        organizerName: '',
        organizerPhone: '',
        organizerEmail: '',
        exactLocation: '',
        invitationMessage: '',
        additionalNotes: ''
      });

    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast({
        title: "❌ Submission Failed",
        description: error.message || "Failed to submit event. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = async (eventId: string | number) => {
    console.log('🚨 BUTTON CLICKED! Event ID:', eventId, typeof eventId);

    // Check if user is logged in
    if (!user) {
      toast({
        title: "⚠️ Login Required",
        description: "Please login to subscribe to event notifications. You'll be redirected to the login page.",
        duration: 4000,
      });
      navigate('/login');
      return;
    }

    const newSubscribed = new Set(subscribedEvents);
    const event = approvedEvents.find(e => e.id === eventId);

    if (!event) return;

    // Add smooth delay before state change
    setTimeout(async () => {
      if (newSubscribed.has(eventId)) {
        // Unsubscribe from notifications
        newSubscribed.delete(eventId);
        setSubscribedEvents(newSubscribed);

        // Save to localStorage for persistence
        const userSubscriptions = JSON.parse(localStorage.getItem(`event_subscriptions_${user.id}`) || '[]');
        const updatedSubscriptions = userSubscriptions.filter((id: number) => id !== eventId);
        localStorage.setItem(`event_subscriptions_${user.id}`, JSON.stringify(updatedSubscriptions));

        // Remove from backend
        await unsubscribeFromEvent(eventId);

        toast({
          title: "🔕 Notification Disabled",
          description: "You won't receive notifications for this event anymore.",
          duration: 3000,
        });
      } else {
        // Subscribe to notifications
        newSubscribed.add(eventId);
        setSubscribedEvents(newSubscribed);

        // Save to localStorage for persistence
        const userSubscriptions = JSON.parse(localStorage.getItem(`event_subscriptions_${user.id}`) || '[]');
        userSubscriptions.push(eventId);
        localStorage.setItem(`event_subscriptions_${user.id}`, JSON.stringify(userSubscriptions));

        // Send to backend and trigger immediate notification
        console.log('🔔 About to call subscribeToEvent with:', event);
        await subscribeToEvent(event);
        console.log('🔔 subscribeToEvent completed');

        toast({
          title: "🔔 Notification Enabled!",
          description: "You'll receive an immediate confirmation and a reminder on the event day.",
          duration: 4000,
        });
      }
    }, 150); // Slight delay for smoother transition
  };

  // Subscribe to event notifications
  const subscribeToEvent = async (event: any) => {
    try {
      // Get FCM token with user ID for better tracking
      const fcmToken = await getFCMToken(user?.id);

      if (!fcmToken) {
        toast({
          title: "⚠️ Permission Required",
          description: "Please allow notifications to receive event updates.",
          duration: 4000,
        });
        return;
      }

      // Send subscription to backend
      const backendUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://santvaani-backend.onrender.com';
      const response = await fetch(`${backendUrl}/api/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time || event.start_time,
          eventLocation: event.location,
          eventCity: event.city || event.address,
          eventType: event.type,
          fcmToken: fcmToken,
          userId: user?.id || 'anonymous',
          userEmail: user?.email || '',
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Successfully subscribed to event notifications:', result);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to subscribe to event notifications:', errorData);
        throw new Error(errorData.message || 'Failed to subscribe to notifications');
      }
    } catch (error) {
      console.error('❌ Error subscribing to event:', error);
    }
  };

  // Unsubscribe from event notifications
  const unsubscribeFromEvent = async (eventId: string | number) => {
    try {
      const backendUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://santvaani-backend.onrender.com';
      const response = await fetch(`${backendUrl}/api/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: user?.id || 'anonymous',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Successfully unsubscribed from event notifications:', result);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to unsubscribe from event notifications:', errorData);
        throw new Error(errorData.message || 'Failed to unsubscribe from notifications');
      }
    } catch (error) {
      console.error('❌ Error unsubscribing from event:', error);
      // Don't throw here as it's called in the success path, just log
    }
  };

  const handleShowDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  // Sample events data - will be replaced with real data later
  const upcomingEvents = [
    {
      id: 1,
      title: "Shrimad Bhagwad Katha",
      description: "7-day spiritual discourse on Krishna's divine teachings by Pandit Raj Kumar Sharma",
      date: "2024-12-28",
      time: "6:00 PM - 8:30 PM",
      location: "Community Hall, Sector 15",
      city: "Noida",
      organizer: "Ram Kishan Gupta",
      type: "bhagwad-katha",
      invitationMessage: "आप सभी भक्तजनों को हार्दिक निमंत्रण है। श्रीमद भागवत कथा के सप्ताह में भगवान श्री कृष्ण की लीलाओं का श्रवण करें। गीता के ज्ञान से अपने जीवन को धन्य बनाएं। प्रसाद सहित सभी व्यवस्था निःशुल्क।"
    },
    {
      id: 2,
      title: "Mata ki Bhandara",
      description: "Free community feast in honor of Durga Ma. All devotees welcome with families",
      date: "2024-12-30",
      time: "12:00 PM - 4:00 PM",
      location: "Durga Mandir",
      city: "Dwarka, Delhi",
      organizer: "Mandir Committee",
      type: "bhandara",
      invitationMessage: "माता रानी की कृपा से आप सभी को भंडारे में सादर आमंत्रित करते हैं। सभी भक्तजन अपने परिवार के साथ पधारें। पूरी-सब्जी, खीर और प्रसाद का आनंद लें। माता की जय!"
    },
    {
      id: 3,
      title: "Sankirtan & Satsang",
      description: "Evening devotional singing with spiritual discussions and prasad distribution",
      date: "2025-01-02",
      time: "5:00 PM - 8:00 PM",
      location: "Radha Krishna Temple",
      city: "Ghaziabad",
      organizer: "Bhakti Mandal",
      type: "kirtan",
      invitationMessage: "Join us for an evening of divine bliss! Experience the joy of devotional singing and spiritual discussions. All are welcome to participate in kirtan and receive blessed prasad. Come with your families and immerse yourself in the divine love of Radha Krishna."
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'bhagwad-katha': return 'from-orange-500 to-red-600';
      case 'bhandara': return 'from-green-500 to-emerald-600';
      case 'kirtan': return 'from-blue-500 to-indigo-600';
      case 'satsang': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'bhagwad-katha': return 'BK';
      case 'bhandara': return 'BH';
      case 'kirtan': return 'KT';
      case 'satsang': return 'ST';
      default: return 'EV';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navbar />

      {/* Header Section */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-blue-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-3xl">🕉️</span>
              <Calendar className="w-8 h-8 text-blue-500 animate-pulse" />
              <span className="text-3xl">📿</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent pt-2">
              {t('events.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('events.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Create Event CTA */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-6 text-white text-center">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{t('events.create.title')}</h2>
                <p className="text-blue-100">{t('events.create.subtitle')}</p>
              </div>
              <button
                onClick={handleCreateEventClick}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>{t('events.create.button')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('events.upcoming.title')}</h2>
              <p className="text-gray-600">{t('events.upcoming.subtitle')}</p>
            </div>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span>{t('events.notify.button')}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingEvents ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-20 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : approvedEvents.length > 0 ? (
              approvedEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Event Type Header */}
                  <div className={`bg-gradient-to-r ${getEventTypeColor(event.type)} p-4 text-white relative`}>
                    {/* Verified Badge */}
                    <div className="absolute top-2 left-2 flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium">{t('events.verified')}</span>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                      <span className="text-lg font-medium uppercase tracking-wide">
                        {event.type.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{event.time}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>{event.location}, {event.city}</span>
                      </div>

                      <div className="flex items-center justify-end text-sm">
                        <span className="text-blue-600 font-medium">by {event.organizer}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleNotificationToggle(event.id)}
                          className={`flex-1 relative overflow-hidden py-3 px-3 rounded-xl transition-all duration-700 ease-in-out text-sm font-medium shadow-md hover:shadow-lg transform ${
                            subscribedEvents.has(event.id)
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                              : user
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-orange-500 hover:to-orange-600 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {subscribedEvents.has(event.id) ? (
                              <>
                                <BellRing className="w-4 h-4" />
                                <span>{t('events.notification.on')}</span>
                              </>
                            ) : (
                              <>
                                {!user ? (
                                  <>
                                    <Shield className="w-4 h-4" />
                                    <span>{t('events.login.notify')}</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="w-4 h-4" />
                                    <span>{t('events.notify.button')}</span>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                          {subscribedEvents.has(event.id) && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          )}
                        </button>
                        <button
                          onClick={() => handleShowDetails(event)}
                          className="px-3 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          {t('events.details.button')}
                        </button>
                        <EventShareButton
                          event={event}
                          className="flex items-center justify-center px-3 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              // No approved events
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('events.no.events.title')}</h3>
                <p className="text-gray-500 mb-6">{t('events.no.events.subtitle')}</p>
                {user && (
                  <button
                    onClick={() => setIsCreateFormOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    {t('events.create.first')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {t('events.community.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('events.community.subtitle')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-2xl p-8 border border-blue-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "{t('events.community.quote.hindi')}"
            </blockquote>
            <p className="text-blue-600 mt-2 text-lg">
              "{t('events.community.quote.english')}"
            </p>
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${getEventTypeColor(selectedEvent.type)} p-6 text-white rounded-t-2xl relative`}>
              <div className="absolute top-2 left-2 flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                <CheckCircle className="w-3 h-3 text-white" />
                <span className="text-xs font-medium">Verified</span>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                <span className="text-sm font-medium uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
                  {selectedEvent.type.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">
                    {new Date(selectedEvent.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{selectedEvent.time}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span>{selectedEvent.location}, {selectedEvent.city}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">About This Event</h3>
                <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Invitation Message */}
              {(selectedEvent.invitation_message || selectedEvent.invitationMessage) && (
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <span>💌</span>
                    <span>Invitation Message</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {selectedEvent.invitation_message || selectedEvent.invitationMessage}
                  </p>
                </div>
              )}

              {/* Organizer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Organized by</h3>
                <p className="text-blue-600 font-medium">{selectedEvent.organizer}</p>
              </div>

              {/* Additional Notes */}
              {selectedEvent.additional_notes && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="font-semibold text-gray-800 mb-2">📝 Additional Notes</h3>
                  <p className="text-gray-700 text-sm">{selectedEvent.additional_notes}</p>
                </div>
              )}

              {/* Exact Location */}
              {selectedEvent.exact_location && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-2">📍 Exact Location</h3>
                  <p className="text-gray-700 text-sm">{selectedEvent.exact_location}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => handleNotificationToggle(selectedEvent.id)}
                  className={`flex-1 relative overflow-hidden py-3 px-4 rounded-xl transition-all duration-700 ease-in-out text-sm font-medium shadow-md hover:shadow-lg transform ${
                    subscribedEvents.has(selectedEvent.id)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      : user
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-orange-500 hover:to-orange-600 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {subscribedEvents.has(selectedEvent.id) ? (
                      <>
                        <BellRing className="w-4 h-4" />
                        <span>Notification On</span>
                      </>
                    ) : (
                      <>
                        {!user ? (
                          <>
                            <Shield className="w-4 h-4" />
                            <span>Login to Notify</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-4 h-4" />
                            <span>Notify Me</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {subscribedEvents.has(selectedEvent.id) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  )}
                </button>
                <EventShareButton
                  event={selectedEvent}
                  variant="outline"
                  size="default"
                  className="px-4 py-3 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-orange-600 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Create Spiritual Event</h2>
                  <p className="text-blue-100">Share your event with the spiritual community</p>
                </div>
                <button
                  onClick={() => setIsCreateFormOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Event Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Event Type *
                </label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bhagwad-katha">Bhagwad Katha</SelectItem>
                    <SelectItem value="bhandara">Bhandara</SelectItem>
                    <SelectItem value="kirtan">Kirtan</SelectItem>
                    <SelectItem value="satsang">Satsang</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional "Other" Event Details */}
              {formData.type === 'other' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Please specify the type of event *
                  </label>
                  <Input
                    placeholder="e.g., Workshop, Spiritual Retreat, Discourse, etc."
                    value={formData.otherEventDetails}
                    onChange={(e) => handleInputChange('otherEventDetails', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Help us understand what kind of spiritual event you're organizing
                  </p>
                </div>
              )}

              {/* Event Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Event Title *
                </label>
                <Input
                  placeholder="e.g., Weekly Bhajan Sandhya"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe your event, what attendees can expect..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date *</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Start Time *</span>
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>End Time</span>
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Venue Name *</span>
                    </label>
                    <Input
                      placeholder="e.g., Radha Krishna Temple"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>City *</span>
                    </label>
                    <Input
                      placeholder="e.g., Delhi, Mumbai, Kolkata"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Exact Location *</span>
                  </label>
                  <Input
                    placeholder="Complete address with landmarks (e.g., 123 Main Street, Near XYZ Market, Sector 15)"
                    value={formData.exactLocation}
                    onChange={(e) => handleInputChange('exactLocation', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Organizer Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Contact Information
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <span>🔒</span>
                    <span>Private</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 leading-relaxed">
                    <span className="font-semibold">Privacy Protected:</span> Your phone number and email address will only be visible to the admin for event approval and coordination. This information will not be displayed publicly to the community.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Your Name *</span>
                    </label>
                    <Input
                      placeholder="Organizer name"
                      value={formData.organizerName}
                      onChange={(e) => handleInputChange('organizerName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number *</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                        +91
                      </span>
                      <Input
                        type="tel"
                        placeholder="XXXXX XXXXX"
                        value={formData.organizerPhone}
                        onChange={(e) => {
                          // Only allow numbers and spaces
                          const value = e.target.value.replace(/[^\d\s]/g, '');
                          handleInputChange('organizerPhone', value);
                        }}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address *</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.organizerEmail}
                    onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* AI-Powered Invitation Message */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Invitation Message
                  </label>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-purple-600 font-medium">AI Powered</span>
                  </div>
                </div>

                {/* AI Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateAIInvitation}
                    disabled={isGeneratingAI || !formData.type || !formData.title || !formData.date}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 flex items-center justify-center space-x-2 py-3"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>🤖 Generate with AI</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={enhanceUserMessage}
                    disabled={isGeneratingAI || !formData.invitationMessage.trim()}
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 flex items-center justify-center space-x-2 py-3"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>✨ Enhance my text</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Suggestions Display */}
                {aiSuggestions.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">AI Generated Suggestions</h4>
                    </div>
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow">
                          <p className="text-gray-700 leading-relaxed mb-3">{suggestion}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(suggestion)}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => selectAISuggestion(suggestion)}
                              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Use This</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Textarea */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write a warm invitation message for attendees in Hindi or English... (e.g., आप सभी भक्तजनों को हार्दिक निमंत्रण है...)"
                    value={formData.invitationMessage}
                    onChange={(e) => handleInputChange('invitationMessage', e.target.value)}
                    rows={4}
                    className="border-gray-300 focus:border-purple-400 focus:ring-purple-300 transition-colors"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      This message will be shown when people click "Details" on your event card
                    </p>
                    {formData.invitationMessage && (
                      <p className="text-xs text-gray-400">
                        {formData.invitationMessage.length} characters
                      </p>
                    )}
                  </div>
                </div>

                {/* Helpful Tips */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-xs">💡</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-800">AI Tips:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Fill in Event Type, Title, Date & Time for better AI generation</li>
                        <li>• AI can generate culturally appropriate Hindi invitations</li>
                        <li>• Use "Enhance" to improve your existing message</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Any special instructions, requirements, or additional information..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={2}
                />
              </div>

              {/* Submission Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">Review Process:</span> Your event will be reviewed by our admin team to ensure it aligns with our spiritual community guidelines. You'll receive a confirmation within 6-12 hours.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateFormOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700"
                >
                  Submit for Approval
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Events;