import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Users, Eye, Clock, RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';

const LiveBhajan = () => {
  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // API base URL - adjust this according to your backend deployment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api' 
    : 'http://localhost:5000/api';

  // Fetch bhajan data from backend
  const fetchBhajans = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setConnectionStatus('connecting');
      
      const response = await fetch(`${API_BASE_URL}/bhajans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for better error handling
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setBhajans(data.data);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
        setNextUpdate(data.nextUpdate ? new Date(data.nextUpdate) : null);
        setError(null);
        setConnectionStatus('connected');
      } else {
        throw new Error(data.message || 'Failed to fetch bhajan data');
      }
      
    } catch (err) {
      console.error('Error fetching bhajans:', err);
      setError(err.message || 'Failed to load bhajan data. Please check your connection.');
      setConnectionStatus('disconnected');
      
      // Fallback to sample data if no data exists
      if (bhajans.length === 0) {
        setBhajans([
          {
            id: 'fallback-1',
            title: "Hare Krishna Hare Rama - Peaceful Chanting",
            channel: "Divine Bhajans",
            duration: "LIVE",
            thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&auto=format",
            videoId: "dQw4w9WgXcQ",
            views: "1.2K",
            isLive: true,
            publishedAt: new Date().toISOString()
          }
        ]);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`${API_BASE_URL}/refresh-bhajans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBhajans(data.data);
          setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
          setError(null);
          setConnectionStatus('connected');
        }
      } else {
        // Fallback to regular fetch if manual refresh fails
        await fetchBhajans(false);
      }
    } catch (err) {
      console.error('Manual refresh failed:', err);
      // Fallback to regular fetch
      await fetchBhajans(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBhajans();
  }, []);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        fetchBhajans();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isRefreshing]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const openYouTube = (videoId, title) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const liveBhajans = bhajans.filter(bhajan => bhajan.isLive);
  const recentBhajans = bhajans.filter(bhajan => !bhajan.isLive);
  const totalViewers = bhajans.reduce((acc, bhajan) => {
    if (bhajan.isLive) {
      const viewCount = parseInt(bhajan.views.replace(/[^0-9]/g, ''));
      return acc + (isNaN(viewCount) ? 0 : viewCount);
    }
    return acc;
  }, 0);

  // Loading state
  if (loading && bhajans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Play className="w-10 h-10 text-white" fill="white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Loading Divine Content...</h2>
              <p className="text-gray-600">Connecting to spiritual channels worldwide</p>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
              <Play className="w-10 h-10 text-white" fill="white" />
            </div>
            {liveBhajans.length > 0 && (
              <div className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-full shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-lg">LIVE</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Live Bhajan Experience
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Immerse yourself in divine devotional content, streaming fresh from the most sacred channels
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                Total Viewers: {totalViewers > 0 ? `${Math.floor(totalViewers/1000)}K+` : 'Loading...'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                Updated: {lastUpdated ? lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="w-5 h-5 text-green-300" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-300" />
              )}
              <span className="font-medium capitalize">{connectionStatus}</span>
            </div>
          </div>

          {/* Manual Refresh Button */}
          <div className="mt-8">
            <Button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Content'}
            </Button>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <section className="py-8 bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
              <Button
                onClick={() => fetchBhajans()}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Live Content Statistics */}
      <section className="py-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-500">{liveBhajans.length}</div>
              <div className="text-sm text-gray-600">Live Streams</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-500">{recentBhajans.length}</div>
              <div className="text-sm text-gray-600">Recent Videos</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-pink-500">{bhajans.length}</div>
              <div className="text-sm text-gray-600">Total Content</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-500">
                {nextUpdate ? Math.ceil((nextUpdate.getTime() - new Date().getTime()) / (1000 * 60)) : '~'}
              </div>
              <div className="text-sm text-gray-600">Mins to Update</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Bhajans Section */}
      {liveBhajans.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Currently Live ({liveBhajans.length})
                </h2>
              </div>
              <p className="text-lg text-gray-600">
                Join thousands of devotees in live spiritual experiences
              </p>
            </div>

            <div className="grid gap-8">
              {liveBhajans.map((bhajan, index) => (
                <Card 
                  key={bhajan.id || `live-${index}`} 
                  className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/95 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Thumbnail */}
                      <div className="relative lg:w-96 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={bhajan.thumbnail} 
                          alt={bhajan.title}
                          className="w-full h-64 lg:h-56 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Live Badge */}
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>LIVE</span>
                        </div>
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl transform scale-95 group-hover:scale-100 transition-transform duration-300">
                            <Play className="w-10 h-10 text-red-500 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-red-600 transition-colors leading-tight">
                            {bhajan.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <span className="text-red-600 font-semibold text-lg">
                              {bhajan.channel}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{bhajan.views} views</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                          <Button
                            onClick={() => openYouTube(bhajan.videoId, bhajan.title)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Watch Live
                          </Button>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 px-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live now with {bhajan.views} viewers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Bhajans Section */}
      {recentBhajans.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Recent Devotional Content ({recentBhajans.length})
              </h2>
              <p className="text-lg text-gray-600">
                Catch up on the latest spiritual bhajans and teachings
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBhajans.map((bhajan, index) => (
                <Card 
                  key={bhajan.id || `recent-${index}`} 
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={bhajan.thumbnail} 
                        alt={bhajan.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {bhajan.duration}
                      </div>
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-xl">
                          <Play className="w-8 h-8 text-orange-600 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
                        {bhajan.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="text-orange-600 font-semibold truncate mr-2">
                          {bhajan.channel}
                        </span>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Eye className="w-3 h-3" />
                          <span>{bhajan.views}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => openYouTube(bhajan.videoId, bhajan.title)}
                        variant="outline"
                        className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors duration-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Auto-Update Notice */}
      <section className="py-12 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 font-bold text-lg">Real-time Updates</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Content is automatically synchronized with YouTube to bring you the freshest devotional experiences. 
              No manual refresh needed - just pure spiritual connection.
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last synchronized: {lastUpdated.toLocaleString()}
                {nextUpdate && (
                  <span className="ml-2">
                    • Next update: {nextUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LiveBhajan;