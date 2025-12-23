import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  Target,
  Award,
  Calendar,
  Flame,
  BarChart3,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface NaamJapEntry {
  id: string;
  date: string;
  count: number;
  notes?: string;
  created_at: string;
}

interface Stats {
  totalCount: number;
  currentStreak: number;
  longestStreak: number;
  thisMonthCount: number;
  averagePerDay: number;
  totalDays: number;
}

const NaamJapTracker = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  // Form state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [count, setCount] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data state
  const [entries, setEntries] = useState<NaamJapEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisMonthCount: 0,
    averagePerDay: 0,
    totalDays: 0
  });
  const [todayEntry, setTodayEntry] = useState<NaamJapEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    // Check if there's an entry for selected date
    const entry = entries.find(e => e.date === selectedDate);
    if (entry) {
      setTodayEntry(entry);
      setCount(entry.count.toString());
      setNotes(entry.notes || '');
    } else {
      setTodayEntry(null);
      setCount('');
      setNotes('');
    }
  }, [selectedDate, entries]);

  const fetchEntries = async () => {
    try {
      setLoading(true);

      // For now, using localStorage for demo
      // TODO: Replace with Supabase when auth is ready
      const storedEntries = localStorage.getItem('naamJapEntries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries);
        calculateStats(parsedEntries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: language === 'HI' ? 'त्रुटि' : 'Error',
        description: language === 'HI' ? 'एंट्रीज़ लोड करने में विफल' : 'Failed to load entries',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (entriesData: NaamJapEntry[]) => {
    if (entriesData.length === 0) {
      setStats({
        totalCount: 0,
        currentStreak: 0,
        longestStreak: 0,
        thisMonthCount: 0,
        averagePerDay: 0,
        totalDays: 0
      });
      return;
    }

    // Total count
    const totalCount = entriesData.reduce((sum, entry) => sum + entry.count, 0);

    // This month count
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCount = entriesData
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      })
      .reduce((sum, entry) => sum + entry.count, 0);

    // Sort entries by date
    const sortedEntries = [...entriesData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const hasEntry = entriesData.some(e => e.date === dateStr);
      if (hasEntry) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = new Date(sortedEntries[i - 1].date);
      const currDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Average per day
    const averagePerDay = Math.round(totalCount / entriesData.length);

    setStats({
      totalCount,
      currentStreak,
      longestStreak,
      thisMonthCount,
      averagePerDay,
      totalDays: entriesData.length
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!count || parseInt(count) < 0) {
      toast({
        title: language === 'HI' ? 'अमान्य इनपुट' : 'Invalid Input',
        description: language === 'HI' ? 'कृपया एक मान्य संख्या दर्ज करें' : 'Please enter a valid number',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const newEntry: NaamJapEntry = {
        id: todayEntry?.id || crypto.randomUUID(),
        date: selectedDate,
        count: parseInt(count),
        notes: notes.trim(),
        created_at: todayEntry?.created_at || new Date().toISOString()
      };

      // Update localStorage (TODO: Replace with Supabase)
      const storedEntries = localStorage.getItem('naamJapEntries');
      let updatedEntries: NaamJapEntry[] = storedEntries ? JSON.parse(storedEntries) : [];

      // Remove existing entry for this date if updating
      updatedEntries = updatedEntries.filter(e => e.date !== selectedDate);
      updatedEntries.push(newEntry);

      localStorage.setItem('naamJapEntries', JSON.stringify(updatedEntries));

      setEntries(updatedEntries);
      calculateStats(updatedEntries);

      toast({
        title: language === 'HI' ? 'सफलतापूर्वक सहेजा गया!' : 'Saved Successfully!',
        description: todayEntry
          ? (language === 'HI' ? 'आपकी प्रविष्टि अपडेट की गई' : 'Your entry has been updated')
          : (language === 'HI' ? 'आपकी प्रविष्टि दर्ज की गई' : 'Your entry has been recorded'),
      });

      // Reset form if it was for today
      if (selectedDate === new Date().toISOString().split('T')[0]) {
        // Keep the values to show what was saved
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: language === 'HI' ? 'त्रुटि' : 'Error',
        description: language === 'HI' ? 'प्रविष्टि सहेजने में विफल' : 'Failed to save entry',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl">🕉️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'HI' ? 'नाम जप ट्रैकर' : 'Naam Jap Tracker'}
            </h1>
            <p className="text-xl text-orange-100">
              {language === 'HI'
                ? 'अपनी आध्यात्मिक साधना को ट्रैक करें और निरंतरता बनाएं'
                : 'Track your spiritual practice and build consistency'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Entry Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entry Form Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  {language === 'HI' ? 'आज की प्रविष्टि दर्ज करें' : 'Log Today\'s Entry'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'HI' ? 'तारीख' : 'Date'}
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'HI' ? 'नाम जप गिनती' : 'Naam Jap Count'} *
                    </label>
                    <Input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      placeholder={language === 'HI' ? 'जैसे: 1080' : 'e.g., 1080'}
                      min="0"
                      required
                      className="w-full text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'HI'
                        ? 'आज आपने कितनी बार नाम जप किया?'
                        : 'How many times did you chant today?'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'HI' ? 'नोट्स (वैकल्पिक)' : 'Notes (Optional)'}
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={language === 'HI'
                        ? 'अपने अनुभव के बारे में कुछ लिखें...'
                        : 'Write about your experience...'}
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {language === 'HI' ? 'सहेजा जा रहा है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {todayEntry
                          ? (language === 'HI' ? 'प्रविष्टि अपडेट करें' : 'Update Entry')
                          : (language === 'HI' ? 'प्रविष्टि सहेजें' : 'Save Entry')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  {language === 'HI' ? 'हाल की प्रविष्टियां' : 'Recent Entries'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">📿</span>
                    <p className="text-gray-600">
                      {language === 'HI'
                        ? 'अभी तक कोई प्रविष्टि नहीं। अपनी यात्रा शुरू करें!'
                        : 'No entries yet. Start your journey!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-600" />
                              <span className="font-medium text-gray-900">
                                {new Date(entry.date).toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-gray-600 mt-1 truncate">{entry.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-orange-600">{entry.count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <Card className="shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Flame className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-orange-100 text-sm uppercase tracking-wide mb-1">
                    {language === 'HI' ? 'वर्तमान स्ट्रीक' : 'Current Streak'}
                  </p>
                  <p className="text-5xl font-bold">{stats.currentStreak}</p>
                  <p className="text-orange-100 text-sm mt-1">
                    {language === 'HI' ? 'दिन' : stats.currentStreak === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">
                        {language === 'HI' ? 'कुल गिनती' : 'Total Count'}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {stats.totalCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">
                        {language === 'HI' ? 'सबसे लंबी स्ट्रीक' : 'Longest Streak'}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {stats.longestStreak} {language === 'HI' ? 'दिन' : 'days'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">
                        {language === 'HI' ? 'इस महीने' : 'This Month'}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {stats.thisMonthCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">
                        {language === 'HI' ? 'औसत प्रति दिन' : 'Avg per Day'}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {stats.averagePerDay.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="w-5 h-5 text-amber-600" />
                  {language === 'HI' ? 'माइलस्टोन' : 'Milestones'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { count: 10000, label: language === 'HI' ? 'समर्पित' : 'Dedicated', emoji: '🌟' },
                    { count: 50000, label: language === 'HI' ? 'प्रतिबद्ध' : 'Committed', emoji: '⭐' },
                    { count: 100000, label: language === 'HI' ? 'भक्त' : 'Devoted', emoji: '💫' },
                    { count: 1000000, label: language === 'HI' ? 'प्रबुद्ध' : 'Enlightened', emoji: '✨' }
                  ].map((milestone) => {
                    const progress = Math.min(100, (stats.totalCount / milestone.count) * 100);
                    const achieved = stats.totalCount >= milestone.count;

                    return (
                      <div key={milestone.count} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {milestone.emoji} {milestone.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {milestone.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              achieved
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : 'bg-gradient-to-r from-orange-500 to-amber-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {achieved && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>{language === 'HI' ? 'प्राप्त!' : 'Achieved!'}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Toaster />
      <Footer />
    </div>
  );
};

export default NaamJapTracker;
