
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Play, Clock, RefreshCw } from 'lucide-react';

// Sample bhajan data - in real app, this would come from YouTube API
const sampleBhajans = [
  {
    id: 1,
    title: "Hare Krishna Hare Rama - Peaceful Chanting",
    channel: "Divine Bhajans",
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
    videoId: "dQw4w9WgXcQ", // Sample YouTube ID
    views: "1.2M views"
  },
  {
    id: 2,
    title: "Om Namah Shivaya - Meditation Bhajan",
    channel: "Spiritual Melodies",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    videoId: "dQw4w9WgXcQ",
    views: "850K views"
  },
  {
    id: 3,
    title: "Radhe Radhe - Devotional Songs",
    channel: "Krishna Bhakti",
    duration: "18:20",
    thumbnail: "https://images.unsplash.com/photo-1544306094-0f7b8ce8bf88?w=300&h=200&fit=crop",
    videoId: "dQw4w9WgXcQ",
    views: "2.1M views"
  },
  {
    id: 4,
    title: "Ganesh Vandana - Morning Prayers",
    channel: "Temple Chants",
    duration: "10:15",
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop",
    videoId: "dQw4w9WgXcQ",
    views: "670K views"
  },
  {
    id: 5,
    title: "Hanuman Chalisa - Powerful Recitation",
    channel: "Bhakti Sangam",
    duration: "8:30",
    thumbnail: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=300&h=200&fit=crop",
    videoId: "dQw4w9WgXcQ",
    views: "3.5M views"
  }
];

const LiveBhajan = () => {
  const [bhajans, setBhajans] = useState(sampleBhajans);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshBhajans();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const refreshBhajans = async () => {
    setIsRefreshing(true);
    
    // Simulate API call - in real app, fetch from YouTube API
    setTimeout(() => {
      // Shuffle the bhajans to simulate new content
      const shuffled = [...sampleBhajans].sort(() => Math.random() - 0.5);
      setBhajans(shuffled);
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const openYouTube = (videoId: string, title: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />
      
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Radio className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-semibold text-lg">LIVE</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Live Bhajan Stream
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience the divine through the latest devotional bhajans from YouTube. 
              Fresh content updated every few minutes to keep your spiritual journey alive.
            </p>
            
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Last updated: {formatTimeAgo(lastRefresh)}</span>
              </div>
              <Button 
                onClick={refreshBhajans}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-orange-300 hover:bg-orange-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bhajan Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {bhajans.map((bhajan, index) => (
              <Card 
                key={bhajan.id} 
                className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 backdrop-blur-sm animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={bhajan.thumbnail} 
                        alt={bhajan.title}
                        className="w-full md:w-80 h-48 md:h-44 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-8 h-8 text-orange-600 ml-1" />
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {bhajan.duration}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-tight">
                        {bhajan.title}
                      </h3>
                      
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                        <span className="text-orange-600 font-semibold text-lg">
                          {bhajan.channel}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {bhajan.views}
                        </span>
                      </div>

                      <div className="flex justify-center md:justify-start pt-4">
                        <Button
                          onClick={() => openYouTube(bhajan.videoId, bhajan.title)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Listen Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Auto-refresh Notice */}
          <div className="text-center mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-200">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-orange-700 font-semibold">Auto-refresh enabled</span>
            </div>
            <p className="text-orange-600 text-sm">
              New bhajans are automatically loaded every 5 minutes to keep the content fresh and spiritually uplifting.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LiveBhajan;
