import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Users, Eye, Clock } from 'lucide-react';

// Sample bhajan data - will be replaced with YouTube API
const sampleBhajans = [
  {
    id: 1,
    title: "Hare Krishna Hare Rama - Peaceful Chanting",
    channel: "Divine Bhajans",
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&auto=format",
    videoId: "dQw4w9WgXcQ",
    views: "1.2M",
    isLive: true
  },
  {
    id: 2,
    title: "Om Namah Shivaya - Meditation Bhajan",
    channel: "Spiritual Melodies",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop&auto=format",
    videoId: "dQw4w9WgXcQ",
    views: "850K",
    isLive: false
  },
  {
    id: 3,
    title: "Radhe Radhe - Devotional Songs",
    channel: "Krishna Bhakti",
    duration: "18:20",
    thumbnail: "https://images.unsplash.com/photo-1544306094-0f7b8ce8bf88?w=400&h=225&fit=crop&auto=format",
    videoId: "dQw4w9WgXcQ",
    views: "2.1M",
    isLive: true
  },
  {
    id: 4,
    title: "Ganesh Vandana - Morning Prayers",
    channel: "Temple Chants",
    duration: "10:15",
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=225&fit=crop&auto=format",
    videoId: "dQw4w9WgXcQ",
    views: "670K",
    isLive: false
  },
  {
    id: 5,
    title: "Hanuman Chalisa - Powerful Recitation",
    channel: "Bhakti Sangam",
    duration: "8:30",
    thumbnail: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=400&h=225&fit=crop&auto=format",
    videoId: "dQw4w9WgXcQ",
    views: "3.5M",
    isLive: true
  }
];

const LiveBhajan = () => {
  const [bhajans, setBhajans] = useState(sampleBhajans);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for live status
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
            <div className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-lg">LIVE</span>
            </div>
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
              <span className="font-medium">Live Viewers: 12.5K+</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Updated: {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
                  Currently Live
                </h2>
              </div>
              <p className="text-lg text-gray-600">
                Join thousands of devotees in live spiritual experiences
              </p>
            </div>

            <div className="grid gap-8">
              {liveBhajans.map((bhajan, index) => (
                <Card 
                  key={bhajan.id} 
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
                            <span>Live now with {Math.floor(Math.random() * 5000 + 1000)} viewers</span>
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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Recent Devotional Content
            </h2>
            <p className="text-lg text-gray-600">
              Catch up on the latest spiritual bhajans and teachings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBhajans.map((bhajan, index) => (
              <Card 
                key={bhajan.id} 
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
                      <span className="text-orange-600 font-semibold">
                        {bhajan.channel}
                      </span>
                      <div className="flex items-center space-x-1">
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

      {/* Auto-Update Notice */}
      <section className="py-12 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 font-bold text-lg">Real-time Updates</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Content is automatically synchronized with YouTube to bring you the freshest devotional experiences. 
              No manual refresh needed - just pure spiritual connection.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LiveBhajan;