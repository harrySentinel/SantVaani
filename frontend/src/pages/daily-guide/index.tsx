import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Bell,
  Sunrise,
  Sunset,
  Moon,
  Star,
  Clock,
  Sparkles,
  Heart,
  Volume2,
  Settings,
  Gift,
  Flame,
  Sun
} from 'lucide-react';
import { usePanchang } from '@/hooks/usePanchang';
import { useSpiritualContent } from '@/hooks/useSpiritualContent';
import { useNotifications } from '@/hooks/useNotifications';

const DailyGuide = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState({
    morning: true,
    evening: true,
    festivals: true,
    ekadashi: true
  });

  const { panchang, loading: panchangLoading } = usePanchang();
  const { todaysContent, loading: contentLoading } = useSpiritualContent();
  const { requestPermission, scheduleNotifications } = useNotifications();

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        scheduleNotifications(selectedReminders);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  // Use dynamic festival data from backend
  const upcomingFestivals = todaysContent?.festivals || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-orange-500 mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Daily Spiritual Guide
              </h1>
              <Sparkles className="w-8 h-8 text-orange-500 ml-2" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your personal companion for daily spiritual practice, Hindu calendar, and divine guidance
            </p>
            <p className="text-lg text-orange-600 mt-2 font-medium">
              आपका दैनिक आध्यात्मिक मार्गदर्शक
            </p>
          </motion.div>

          {/* Notification Settings Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="max-w-4xl mx-auto border-orange-200 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <Bell className="w-6 h-6 text-orange-500 mr-2" />
                  <CardTitle className="text-2xl text-gray-800">Daily Blessings Notifications</CardTitle>
                </div>
                <p className="text-gray-600">Get reminded for morning prayers, evening aarti, and festivals</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-gray-700">Disable Notifications</span>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                    className="data-[state=checked]:bg-orange-500"
                  />
                  <span className="text-gray-700">Enable Notifications</span>
                </div>
                
                {notificationsEnabled && (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-orange-100">
                    {[
                      { key: 'morning', label: 'Morning Prayers', time: '6:00 AM' },
                      { key: 'evening', label: 'Evening Aarti', time: '6:00 PM' },
                      { key: 'festivals', label: 'Festival Reminders', time: 'As needed' },
                      { key: 'ekadashi', label: 'Ekadashi Alerts', time: 'Monthly' }
                    ].map((reminder) => (
                      <div key={reminder.key} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{reminder.label}</p>
                          <p className="text-sm text-gray-500">{reminder.time}</p>
                        </div>
                        <Switch
                          checked={selectedReminders[reminder.key as keyof typeof selectedReminders]}
                          onCheckedChange={(checked) => 
                            setSelectedReminders(prev => ({ ...prev, [reminder.key]: checked }))
                          }
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Panchang Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-orange-200 shadow-lg bg-white/90 backdrop-blur-sm h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <CardTitle className="text-xl text-gray-800">Today's Panchang</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {panchangLoading || contentLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-orange-100 rounded w-3/4"></div>
                      <div className="h-4 bg-orange-100 rounded w-1/2"></div>
                      <div className="h-4 bg-orange-100 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Date and Location */}
                      <div className="text-center p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                        <h3 className="text-lg font-semibold">
                          {new Date().toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <p className="text-sm opacity-90">Delhi, India</p>
                      </div>

                      {/* Panchang Elements Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { 
                            label: 'Tithi', 
                            labelHi: 'तिथि', 
                            value: todaysContent?.specialDay?.name || 'Shukla Tritiya',
                            icon: Moon 
                          },
                          { 
                            label: 'Sunrise', 
                            labelHi: 'सूर्योदय', 
                            value: '6:15 AM', 
                            icon: Sunrise 
                          },
                          { 
                            label: 'Sunset', 
                            labelHi: 'सूर्यास्त', 
                            value: '6:45 PM', 
                            icon: Sunset 
                          },
                          { 
                            label: 'Nakshatra', 
                            labelHi: 'नक्षत्र', 
                            value: 'Rohini', 
                            icon: Star 
                          },
                          { 
                            label: 'Muhurat', 
                            labelHi: 'मुहूर्त', 
                            value: '8:30-9:15 AM', 
                            icon: Clock 
                          },
                          { 
                            label: 'Moon Phase', 
                            labelHi: 'चंद्र स्थिति', 
                            value: 'Waxing', 
                            icon: Moon 
                          }
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-2 mb-2">
                              <item.icon className="w-4 h-4 text-orange-600" />
                              <span className="font-medium text-gray-800 text-sm">{item.label}</span>
                              <span className="text-xs text-orange-600">({item.labelHi})</span>
                            </div>
                            <p className="text-gray-700 font-medium text-sm">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Special Message */}
                      {todaysContent?.specialDay?.description && (
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-orange-400">
                          <p className="text-sm text-gray-700 italic">
                            ✨ {todaysContent.specialDay.description}
                          </p>
                          {todaysContent.specialDay.descriptionHi && (
                            <p className="text-xs text-gray-600 mt-1">
                              {todaysContent.specialDay.descriptionHi}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Spiritual Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Today's Mantra */}
              <Card className="border-orange-200 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <CardTitle className="text-lg text-gray-800">Today's Mantra</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <p className="text-2xl font-bold text-orange-700 tracking-wide">
                      {todaysContent?.mantra?.sanskrit || 'ॐ नमः शिवाय'}
                    </p>
                    <p className="text-gray-600 font-medium">
                      {todaysContent?.mantra?.transliteration || 'Om Namah Shivaya'}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {todaysContent?.mantra?.meaning || '"I bow to Shiva" - A powerful mantra for inner peace and spiritual awakening'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Spiritual Fact */}
              <Card className="border-orange-200 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-orange-500" />
                    <CardTitle className="text-lg text-gray-800">Spiritual Wisdom</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    {todaysContent?.quote?.quote || '"The mind is everything. What you think you become."'}
                  </blockquote>
                  <p className="text-orange-600 font-medium mt-2 text-sm">
                    - {todaysContent?.quote?.author || 'Buddha'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Upcoming Festivals */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <Card className="border-orange-200 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Gift className="w-6 h-6 text-orange-500" />
                  <CardTitle className="text-xl text-gray-800">Upcoming Festivals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {upcomingFestivals.length > 0 ? upcomingFestivals.map((festival, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{festival.name}</h3>
                        <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                          {festival.daysLeft === 0 ? 'Today!' :
                           festival.daysLeft === 1 ? 'Tomorrow' :
                           `${festival.daysLeft} days`}
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-600 mb-1">{festival.nameHi || festival.name}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{festival.significance || festival.description}</p>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Loading upcoming festivals...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Horoscope CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-8"
          >
            <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                    <h3 className="text-2xl font-bold text-gray-800">Daily Horoscope</h3>
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover what the stars have in store for you with personalized daily, weekly, and monthly predictions
                  </p>
                  <p className="text-purple-600 font-medium">
                    अपनी दैनिक, साप्ताहिक और मासिक राशिफल जानें
                  </p>
                  <div className="pt-4">
                    <a
                      href="/horoscope"
                      className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      View Your Horoscope
                    </a>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                    <div className="bg-white/60 rounded-lg p-3">
                      <Sun className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                      <p className="font-medium text-gray-700">Daily</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="font-medium text-gray-700">Weekly</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <Moon className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                      <p className="font-medium text-gray-700">Monthly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DailyGuide;