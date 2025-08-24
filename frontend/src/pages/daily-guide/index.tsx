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
  Flame
} from 'lucide-react';
import { usePanchang } from '@/hooks/usePanchang';
import { useSpiritualContent } from '@/hooks/useSpiritualContent';
import { useNotifications } from '@/hooks/useNotifications';
import HoroscopeSection from '@/components/HoroscopeSection';

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

  const upcomingFestivals = [
    { name: 'Diwali', nameHi: 'दिवाली', daysLeft: 15, significance: 'Festival of Lights' },
    { name: 'Karva Chauth', nameHi: 'करवा चौथ', daysLeft: 8, significance: 'Fast for husband\'s long life' },
    { name: 'Dhanteras', nameHi: 'धनतेरस', daysLeft: 13, significance: 'Worship of wealth and prosperity' }
  ];

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
                <p className="text-gray-600">Receive spiritual guidance directly to your device</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Toggle */}
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Enable Daily Notifications</h3>
                    <p className="text-sm text-gray-600">Get morning mantras, evening prayers & festival reminders</p>
                  </div>
                  <Switch 
                    checked={notificationsEnabled} 
                    onCheckedChange={handleNotificationToggle}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>

                {/* Notification Types */}
                {notificationsEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {[
                      { key: 'morning', icon: Sunrise, title: 'Morning Mantras', desc: 'Start your day with divine blessings (7:00 AM)' },
                      { key: 'evening', icon: Sunset, title: 'Evening Prayers', desc: 'End your day with gratitude (6:30 PM)' },
                      { key: 'festivals', icon: Gift, title: 'Festival Alerts', desc: 'Never miss important Hindu festivals' },
                      { key: 'ekadashi', icon: Moon, title: 'Ekadashi Reminders', desc: 'Fasting days and spiritual observances' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center space-x-3 p-3 rounded-lg border border-orange-100 hover:bg-orange-50/50 transition-colors">
                        <item.icon className="w-5 h-5 text-orange-500" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.title}</h4>
                          <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={selectedReminders[item.key as keyof typeof selectedReminders]} 
                          onCheckedChange={(checked) => 
                            setSelectedReminders(prev => ({ ...prev, [item.key]: checked }))
                          }
                          className="data-[state=checked]:bg-orange-400"
                          size="sm"
                        />
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Preview Button */}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      // Show preview notification
                      if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('🕉️ SantVaani Daily Blessing', {
                          body: 'Good morning! Today\'s mantra: Om Namah Shivaya 🙏',
                          icon: '/favicon.ico'
                        });
                      }
                    }}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Preview Notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Spiritual Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Hindu Calendar (Panchang) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2"
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
                  {panchangLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-orange-100 rounded w-3/4"></div>
                      <div className="h-4 bg-orange-100 rounded w-1/2"></div>
                      <div className="h-4 bg-orange-100 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: 'Today', labelHi: 'आज', value: panchang?.date || 'Loading...', icon: Calendar },
                        { label: 'Tithi', labelHi: 'तिथि', value: panchang?.tithi || 'Shukla Tritiya', icon: Moon },
                        { label: 'Nakshatra', labelHi: 'नक्षत्र', value: panchang?.nakshatra || 'Rohini', icon: Star },
                        { label: 'Sunrise', labelHi: 'सूर्योदय', value: panchang?.sunrise || '6:15 AM', icon: Sunrise },
                        { label: 'Sunset', labelHi: 'सूर्यास्त', value: panchang?.sunset || '6:45 PM', icon: Sunset },
                        { label: 'Muhurat', labelHi: 'मुहूर्त', value: panchang?.muhurat || '8:30-9:15 AM', icon: Clock }
                      ].map((item, index) => (
                        <div key={index} className="p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg border border-orange-200">
                          <div className="flex items-center space-x-2 mb-1">
                            <item.icon className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-gray-800">{item.label}</span>
                            <span className="text-sm text-orange-600">({item.labelHi})</span>
                          </div>
                          <p className="text-gray-700 font-medium">{item.value}</p>
                        </div>
                      ))}
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
                      ॐ नमः शिवाय
                    </p>
                    <p className="text-gray-600 font-medium">
                      Om Namah Shivaya
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      "I bow to Shiva" - A powerful mantra for inner peace and spiritual awakening
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
                    "The mind is everything. What you think you become."
                  </blockquote>
                  <p className="text-orange-600 font-medium mt-2 text-sm">- Buddha</p>
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
                  {upcomingFestivals.map((festival, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{festival.name}</h3>
                        <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                          {festival.daysLeft} days
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-600 mb-1">{festival.nameHi}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{festival.significance}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Horoscope Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-8"
          >
            <HoroscopeSection />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DailyGuide;