import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  User,
  LogOut,
  Eye,
  Loader2,
  Gift,
  Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { eventsService, Event } from '@/lib/events';
import DivineWelcomeLetter from '@/components/DivineWelcomeLetter';

const Dashboard = () => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [showWelcomeLetter, setShowWelcomeLetter] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!loading && !user) {
      toast({
        title: "⚠️ Authentication Required",
        description: "Please login to access dashboard",
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    // Load user's events from database
    if (user) {
      loadUserEvents();
      loadUserProfile();

      // Always show welcome letter initially (robust fallback)
      // This ensures it shows even if backend APIs are down
      setShowWelcomeLetter(true);
    }
  }, [user, loading, navigate]);

  const loadUserEvents = async () => {
    if (!user) return;

    try {
      setIsLoadingEvents(true);
      console.log('Loading events for user ID:', user.id);
      const events = await eventsService.getUserEvents(user.id);
      console.log('Retrieved events:', events);
      setUserEvents(events);
    } catch (error) {
      console.error('Error loading user events:', error);
      toast({
        title: "⚠️ Error Loading Events",
        description: "Failed to load your events. Please refresh the page.",
        duration: 4000,
      });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const backendUrl = import.meta.env.MODE === 'development'
        ? 'http://localhost:5000'
        : import.meta.env.VITE_BACKEND_URL || 'https://santvaani-backend.onrender.com';

      const response = await fetch(`${backendUrl}/api/user/profile/${user.id}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setUserProfile(data.profile);

        // Show welcome letter for new users or those who haven't downloaded it
        if (!data.profile.welcome_letter_downloaded) {
          setShowWelcomeLetter(true);
        }

        // Show special welcome message for first-time users
        if (data.isFirstLogin) {
          toast({
            title: "🙏 Welcome to SantVaani!",
            description: "Your divine journey begins today. Check out your special welcome gift below!",
            duration: 6000,
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback: Show welcome letter for testing
      const fallbackProfile = {
        welcome_letter_downloaded: false,
        first_login_at: user.created_at,
        total_events_created: userEvents.length
      };
      setUserProfile(fallbackProfile);
      setShowWelcomeLetter(true);

      // Show welcome toast
      toast({
        title: "🙏 Welcome to SantVaani!",
        description: "Check out your special divine welcome letter below!",
        duration: 6000,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "👋 Logged Out",
        description: "Successfully logged out. Come back soon!",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "⚠️ Logout Error",
        description: "Failed to logout. Please try again.",
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'approved': return 'from-green-500 to-emerald-600';
      case 'rejected': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved & Live';
      case 'rejected': return 'Needs Revision';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login in useEffect
  }

  const stats = {
    total: userEvents.length,
    pending: userEvents.filter(e => e.status === 'pending').length,
    approved: userEvents.filter(e => e.status === 'approved').length,
    rejected: userEvents.filter(e => e.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navbar />

      {/* Dashboard Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-blue-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Welcome, {user.user_metadata?.name || user.email?.split('@')[0]}!
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <p className="text-lg text-gray-600">
                Manage your spiritual events and track their approval status
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/events">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>View All Events</span>
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Needs Revision</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Divine Welcome Letter Section */}
      {showWelcomeLetter && user && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white text-center mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start space-x-3">
                    <Gift className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Welcome Gift for You!</h2>
                  </div>
                  <p className="text-orange-100">
                    Download your personalized divine welcome letter as a beautiful PDF
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const letterElement = document.querySelector('[data-welcome-letter]');
                    letterElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white text-orange-600 hover:bg-orange-50 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Letter</span>
                </Button>
              </div>
            </div>

            <div data-welcome-letter>
              <DivineWelcomeLetter
                userName={user.user_metadata?.name || user.email?.split('@')[0] || 'Divine Soul'}
                userEmail={user.email || ''}
                joinDate={user.created_at || new Date().toISOString()}
                userId={user.id}
                onDownloadComplete={() => {
                  // Hide the welcome letter section after download
                  setShowWelcomeLetter(false);
                  toast({
                    title: "🎉 Welcome Gift Saved!",
                    description: "Your divine welcome letter is now in your downloads. You can always access it from your profile.",
                    duration: 5000,
                  });
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Create New Event CTA */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-6 text-white text-center">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Ready to organize another event?</h2>
                <p className="text-blue-100">Share your spiritual gathering with the community</p>
              </div>
              <Link to="/events">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 transition-colors flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create New Event</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* User Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Events</h2>
            <p className="text-gray-600">Track the status of your submitted events</p>
          </div>

          {isLoadingEvents ? (
            // Loading skeleton
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-20 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : userEvents.length === 0 ? (
            <Card className="text-center py-12 shadow-lg border-0">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
                <p className="text-gray-500 mb-6">You haven't submitted any events for approval</p>
                <Link to="/events">
                  <Button className="bg-gradient-to-r from-blue-600 to-orange-600">
                    Create Your First Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEvents.map((event) => {
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <Card key={event.id} className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Status Header */}
                      <div className={`bg-gradient-to-r ${getStatusColor(event.status)} p-4 text-white`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-5 h-5" />
                            <span className="font-semibold text-sm">
                              {getStatusText(event.status)}
                            </span>
                          </div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            {event.type}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {event.description}
                          </p>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}, {event.city}</span>
                          </div>
                        </div>

                        {/* Admin Feedback */}
                        {event.adminFeedback && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-1">Admin Feedback:</p>
                            <p className="text-sm text-gray-600">{event.adminFeedback}</p>
                          </div>
                        )}

                        {/* Submitted Date */}
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Submitted on {new Date(event.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;