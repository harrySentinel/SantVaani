import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Link } from 'react-router-dom';

interface NaamJapEntry {
  id: string;
  user_id: string;
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
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Form state - ALWAYS today's date only
  const todayDate = new Date().toISOString().split('T')[0];
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
    if (user) {
      fetchEntries();
    }
  }, [user]);

  useEffect(() => {
    // Check if there's an entry for TODAY only
    const entry = entries.find(e => e.date === todayDate);
    if (entry) {
      setTodayEntry(entry);
      setCount(entry.count.toString());
      setNotes(entry.notes || '');
    } else {
      setTodayEntry(null);
      setCount('');
      setNotes('');
    }
  }, [entries, todayDate]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch entries from Supabase
      const { data, error } = await supabase
        .from('naam_jap_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      console.error('Error fetching entries:', error);
      toast({
        title: language === 'HI' ? 'त्रुटि' : 'Error',
        description: error.message || (language === 'HI' ? 'एंट्रीज़ लोड करने में विफल' : 'Failed to load entries'),
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

    if (!user) return;

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
      const entryData = {
        user_id: user.id,
        date: todayDate, // Only allow entries for today
        count: parseInt(count),
        notes: notes.trim() || null
      };

      if (todayEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('naam_jap_entries')
          .update(entryData)
          .eq('id', todayEntry.id);

        if (error) throw error;

        toast({
          title: language === 'HI' ? 'सफलतापूर्वक अपडेट किया गया!' : 'Updated Successfully!',
          description: language === 'HI' ? 'आपकी प्रविष्टि अपडेट की गई' : 'Your entry has been updated',
        });
      } else {
        // Insert new entry
        const { error } = await supabase
          .from('naam_jap_entries')
          .insert([entryData]);

        if (error) throw error;

        toast({
          title: language === 'HI' ? 'सफलतापूर्वक सहेजा गया!' : 'Saved Successfully!',
          description: language === 'HI' ? 'आपकी प्रविष्टि दर्ज की गई' : 'Your entry has been recorded',
        });
      }

      // Refresh entries
      await fetchEntries();
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast({
        title: language === 'HI' ? 'त्रुटि' : 'Error',
        description: error.message || (language === 'HI' ? 'प्रविष्टि सहेजने में विफल' : 'Failed to save entry'),
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">{language === 'HI' ? 'लोड हो रहा है...' : 'Loading...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />

        {/* Header */}
        <section className="pt-24 pb-12 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-7xl font-bold">ॐ</span>
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

        {/* Login Prompt */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="shadow-xl border-2 border-orange-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                    <LogIn className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {language === 'HI' ? 'लॉगिन आवश्यक है' : 'Login Required'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'HI'
                      ? 'अपनी नाम जप यात्रा को ट्रैक करने और अपने सभी उपकरणों में डेटा को सिंक रखने के लिए, कृपया अपने खाते में लॉगिन करें।'
                      : 'To track your Naam Jap journey and keep your data synced across all your devices, please login to your account.'}
                  </p>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 space-y-3 text-left">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    {language === 'HI' ? 'लॉगिन करने से आप पाएंगे:' : 'With login you get:'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{language === 'HI' ? 'सभी उपकरणों में सिंक किया गया डेटा' : 'Data synced across all devices'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{language === 'HI' ? 'सटीक स्ट्रीक ट्रैकिंग' : 'Accurate streak tracking'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{language === 'HI' ? 'सुरक्षित क्लाउड बैकअप' : 'Secure cloud backup'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{language === 'HI' ? 'जीवन भर का डेटा संरक्षण' : 'Lifetime data preservation'}</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/login" className="flex-1 sm:flex-initial">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      {language === 'HI' ? 'लॉगिन करें' : 'Login'}
                    </Button>
                  </Link>

                  <Link to="/signup" className="flex-1 sm:flex-initial">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      {language === 'HI' ? 'साइन अप करें' : 'Sign Up'}
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-gray-500">
                  {language === 'HI'
                    ? 'मुफ्त खाता बनाएं • केवल 30 सेकंड लगते हैं'
                    : 'Create free account • Takes only 30 seconds'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  // Show loading while fetching entries
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">{language === 'HI' ? 'एंट्रीज़ लोड हो रही हैं...' : 'Loading entries...'}</p>
          </div>
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
              <span className="text-7xl font-bold">ॐ</span>
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
                      {language === 'HI' ? 'तारीख (केवल आज)' : 'Date (Today Only)'}
                    </label>
                    <div className="w-full p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-gray-800 font-medium">
                        {new Date().toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {language === 'HI'
                          ? '⚠️ पिछली तारीखों के लिए एंट्री नहीं जोड़ी जा सकती'
                          : '⚠️ Cannot add entries for past dates'}
                      </p>
                    </div>
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
                    <p className="text-gray-600 mb-2">
                      {language === 'HI'
                        ? 'अभी तक कोई प्रविष्टि नहीं। अपनी यात्रा शुरू करें!'
                        : 'No entries yet. Start your journey!'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'HI'
                        ? 'आपका डेटा सुरक्षित रूप से डेटाबेस में संग्रहीत है'
                        : 'Your data is securely stored in the database'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entries.slice(0, 10).map((entry) => (
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

      {/* Instructions / How It Works - Moved to bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              {language === 'HI' ? 'यह कैसे काम करता है' : 'How It Works'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Rule 1: Today Only */}
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  {language === 'HI' ? 'केवल आज' : 'Today Only'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'HI'
                    ? 'आप केवल आज की प्रविष्टि जोड़ या अपडेट कर सकते हैं। दिन बीत जाने के बाद, यह हमेशा के लिए लॉक हो जाती है।'
                    : 'You can only add or update your entry for today. Once the day passes, it\'s locked forever.'}
                </p>
              </div>

              {/* Rule 2: One Entry Per Day */}
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  {language === 'HI' ? 'दिन में एक बार' : 'One Entry Per Day'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'HI'
                    ? 'आज की गिनती जोड़ें, और दिन के दौरान कभी भी इसे अपडेट करें। कल, आप नए सिरे से शुरू करेंगे।'
                    : 'Add your count for today, and update it anytime during the day. Tomorrow, you start fresh.'}
                </p>
              </div>

              {/* Rule 3: Authentic Streaks */}
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  {language === 'HI' ? 'प्रामाणिक स्ट्रीक' : 'Authentic Streaks'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'HI'
                    ? 'पिछली तारीख की एंट्री नहीं। यदि आप एक दिन चूक जाते हैं, तो आपकी स्ट्रीक टूट जाती है। यह वास्तविक दैनिक अभ्यास सुनिश्चित करता है।'
                    : 'No backdating allowed. If you miss a day, your streak breaks. This ensures genuine daily practice.'}
                </p>
              </div>

              {/* Rule 4: Daily Discipline */}
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  {language === 'HI' ? 'दैनिक अनुशासन' : 'Daily Discipline'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'HI'
                    ? 'दैनिक प्रतिबद्धता के माध्यम से निरंतरता बनाएं। आपकी आध्यात्मिक यात्रा समर्पण की मांग करती है।'
                    : 'Build consistency through daily commitment. Your spiritual journey deserves dedication.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster />
      <Footer />
    </div>
  );
};

export default NaamJapTracker;
