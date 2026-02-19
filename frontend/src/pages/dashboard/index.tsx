import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  User,
  LogOut,
  Eye,
  Gift,
  Bookmark,
  BookOpen,
  List,
  Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { eventsService, Event } from '@/lib/events';
import DivineWelcomeLetter from '@/components/DivineWelcomeLetter';
import { getUserBookmarks } from '@/services/blogSocialService';

const Dashboard = () => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [showWelcomeLetter, setShowWelcomeLetter] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedBlogs, setSavedBlogs] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const savedBlogsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please login to access dashboard",
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    if (user) {
      loadUserEvents();
      loadUserProfile();
      loadSavedBlogs();
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
        title: "Error Loading Events",
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

        if (!data.profile.welcome_letter_downloaded) {
          setShowWelcomeLetter(true);
        }

        if (data.isFirstLogin) {
          toast({
            title: "Welcome to Santvaani! 🙏",
            description: "Your divine journey begins today. Check out your special welcome gift below!",
            duration: 6000,
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      const fallbackProfile = {
        welcome_letter_downloaded: false,
        first_login_at: user.created_at,
        total_events_created: userEvents.length
      };
      setUserProfile(fallbackProfile);
      setShowWelcomeLetter(true);

      toast({
        title: "Welcome to Santvaani! 🙏",
        description: "Check out your special divine welcome letter below!",
        duration: 6000,
      });
    }
  };

  const loadSavedBlogs = async () => {
    if (!user) return;

    try {
      setIsLoadingBlogs(true);
      console.log('Loading bookmarks for user ID:', user.id);
      const result = await getUserBookmarks(user.id);

      if (result.success) {
        const blogs = result.bookmarks
          .map((bookmark: any) => bookmark.blog_posts)
          .filter((blog: any) => blog !== null);

        console.log('Retrieved bookmarked blogs:', blogs);
        setSavedBlogs(blogs);
      } else {
        throw new Error(result.error || 'Failed to load bookmarks');
      }
    } catch (error) {
      console.error('Error loading saved blogs:', error);
      toast({
        title: "Error Loading Bookmarks",
        description: "Failed to load your saved blogs. Please refresh the page.",
        duration: 4000,
      });
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "Successfully logged out. Come back soon!",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'from-yellow-400 to-amber-500';
      case 'approved': return 'from-green-500 to-emerald-600';
      case 'rejected': return 'from-red-500 to-red-600';
      default: return 'from-gray-400 to-gray-500';
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <span className="text-5xl text-orange-400 animate-pulse block" style={{ fontFamily: 'serif' }}>ॐ</span>
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    total: userEvents.length,
    pending: userEvents.filter(e => e.status === 'pending').length,
    approved: userEvents.filter(e => e.status === 'approved').length,
    rejected: userEvents.filter(e => e.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Dashboard Header */}
      <section className="pt-20 pb-10 bg-orange-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}
                </h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-500 text-sm mt-0.5">Manage your spiritual events and bookmarks</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <Link to="/profile-settings">
                <Button variant="outline" size="sm" className="flex items-center space-x-1.5 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="sm" className="flex items-center space-x-1.5 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                  <span>All Events</span>
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1.5 text-red-500 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 -mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-7 h-7 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4 text-center">
                <AlertCircle className="w-7 h-7 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-7 h-7 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-sm text-gray-500">Approved</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4 text-center">
                <XCircle className="w-7 h-7 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-500">Needs Revision</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-500 text-sm mt-0.5">Navigate to your favourite sections</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/blog')}
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">Browse Blogs</p>
                <p className="text-xs text-gray-400 mt-0.5">Read latest posts</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => scrollToSection(savedBlogsRef)}
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Bookmark className="w-6 h-6 text-amber-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">My Bookmarks</p>
                <p className="text-xs text-gray-400 mt-0.5">View saved blogs</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/events')}
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">Create Event</p>
                <p className="text-xs text-gray-400 mt-0.5">Organise gathering</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => scrollToSection(eventsRef)}
            >
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <List className="w-6 h-6 text-red-400" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">My Events</p>
                <p className="text-xs text-gray-400 mt-0.5">View your events</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Divine Welcome Letter Section */}
      {showWelcomeLetter && user && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-orange-500 rounded-2xl p-6 text-white mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Welcome Gift for You!</h2>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Download your personalised divine welcome letter as a beautiful PDF
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const letterElement = document.querySelector('[data-welcome-letter]');
                    letterElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white text-orange-600 hover:bg-orange-50 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
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
                  setShowWelcomeLetter(false);
                  toast({
                    title: "Welcome Gift Saved!",
                    description: "Your divine welcome letter is now in your downloads. You can always access it from your profile.",
                    duration: 5000,
                  });
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Saved Blogs Section */}
      <section className="py-10" ref={savedBlogsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Saved Blogs</h2>
            <p className="text-gray-500 text-sm">Your bookmarked spiritual readings</p>
          </div>

          {isLoadingBlogs ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border border-gray-100 bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-100"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : savedBlogs.length === 0 ? (
            <Card className="text-center py-12 border border-gray-100 shadow-sm">
              <CardContent>
                <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-600 mb-1">No Saved Blogs Yet</h3>
                <p className="text-gray-400 text-sm mb-5">Start bookmarking blogs to save them for later</p>
                <Link to="/blog">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm">
                    Browse Blogs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedBlogs.map((blog: any) => (
                <Card key={blog.id} className="border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="h-40 overflow-hidden bg-orange-50 flex items-center justify-center">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-orange-200" />
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <Link to={`/blog/${blog.slug}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1.5 border-orange-200 text-orange-600 hover:bg-orange-50 text-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read More</span>
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-400">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* User Events */}
      <section className="py-10 bg-orange-50/30" ref={eventsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Events</h2>
            <p className="text-gray-500 text-sm">Track the status of your submitted events</p>
          </div>

          {isLoadingEvents ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border border-gray-100 bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-16 bg-gray-100"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : userEvents.length === 0 ? (
            <Card className="text-center py-12 border border-gray-100 shadow-sm bg-white">
              <CardContent>
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-600 mb-1">No Events Yet</h3>
                <p className="text-gray-400 text-sm mb-5">You haven't submitted any events for approval</p>
                <Link to="/events">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm">
                    Create Your First Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userEvents.map((event) => {
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <Card key={event.id} className="border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Status Header */}
                      <div className={`bg-gradient-to-r ${getStatusColor(event.status)} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-semibold text-sm">
                              {getStatusText(event.status)}
                            </span>
                          </div>
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            {event.type}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800 mb-1">
                            {event.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {event.description}
                          </p>
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-orange-400" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-orange-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-orange-400" />
                            <span>{event.location}, {event.city}</span>
                          </div>
                        </div>

                        {/* Admin Feedback */}
                        {event.adminFeedback && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs font-medium text-gray-600 mb-1">Admin Feedback:</p>
                            <p className="text-sm text-gray-500">{event.adminFeedback}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-400">
                            Submitted {new Date(event.created_at).toLocaleDateString()}
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
