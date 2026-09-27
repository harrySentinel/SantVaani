'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  Save,
  Loader2,
  LogIn,
  UserPlus,
  Check,
  FileDown,
} from 'lucide-react';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import Link from '@/components/SiteLink';
import NaamJapCounter from '@/components/naam-jap/NaamJapCounter';
import { downloadMonthlyNaamJapReport } from '@/utils/naamJapReport';

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

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';
const pressable = 'transition-transform duration-150 active:scale-[0.97]';

const MILESTONES = [
  { count: 10000, label: { hi: 'समर्पित', en: 'Dedicated' } },
  { count: 50000, label: { hi: 'प्रतिबद्ध', en: 'Committed' } },
  { count: 100000, label: { hi: 'भक्त', en: 'Devoted' } },
  { count: 1000000, label: { hi: 'प्रबुद्ध', en: 'Enlightened' } },
];

// entry.date is a plain "YYYY-MM-DD" string. `new Date(dateString)` parses that as UTC
// midnight, then .getMonth()/.getDate() read it back in local time — which silently
// shifts the date by a day for anyone not in UTC. Parse and format from local parts instead.
const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function NaamJapTracker() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const HI = language === 'HI';

  const todayDate = toLocalDateStr(new Date());
  const [count, setCount] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [entries, setEntries] = useState<NaamJapEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisMonthCount: 0,
    averagePerDay: 0,
    totalDays: 0,
  });
  const [todayEntry, setTodayEntry] = useState<NaamJapEntry | null>(null);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  useEffect(() => {
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
      const { data, error } = await supabase
        .from('naam_jap_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      setEntries(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast({
        title: HI ? 'त्रुटि' : 'Error',
        description: error.message || (HI ? 'एंट्रीज़ लोड करने में विफल' : 'Failed to load entries'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (entriesData: NaamJapEntry[]) => {
    if (entriesData.length === 0) {
      setStats({ totalCount: 0, currentStreak: 0, longestStreak: 0, thisMonthCount: 0, averagePerDay: 0, totalDays: 0 });
      return;
    }

    const totalCount = entriesData.reduce((sum, entry) => sum + entry.count, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCount = entriesData
      .filter(entry => {
        const entryDate = parseLocalDate(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      })
      .reduce((sum, entry) => sum + entry.count, 0);

    const sortedEntries = [...entriesData].sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = toLocalDateStr(checkDate);
      if (entriesData.some(e => e.date === dateStr)) currentStreak++;
      else break;
    }

    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = parseLocalDate(sortedEntries[i - 1].date);
      const currDate = parseLocalDate(sortedEntries[i].date);
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) tempStreak++;
      else { longestStreak = Math.max(longestStreak, tempStreak); tempStreak = 1; }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    setStats({
      totalCount,
      currentStreak,
      longestStreak,
      thisMonthCount,
      averagePerDay: Math.round(totalCount / entriesData.length),
      totalDays: entriesData.length,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!count || parseInt(count) < 0) {
      toast({
        title: HI ? 'अमान्य इनपुट' : 'Invalid Input',
        description: HI ? 'कृपया एक मान्य संख्या दर्ज करें' : 'Please enter a valid number',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const entryData = { user_id: user.id, date: todayDate, count: parseInt(count), notes: notes.trim() || null };

      if (todayEntry) {
        const { error } = await supabase.from('naam_jap_entries').update(entryData).eq('id', todayEntry.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('naam_jap_entries').insert([entryData]);
        if (error) throw error;
      }

      toast({
        title: HI ? 'सहेजा गया' : 'Saved',
        description: HI ? 'आपकी आज की गिनती दर्ज कर ली गई है' : 'Today’s count has been recorded',
      });
      await fetchEntries();
    } catch (error: any) {
      toast({
        title: HI ? 'त्रुटि' : 'Error',
        description: error.message || (HI ? 'प्रविष्टि सहेजने में विफल' : 'Failed to save entry'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    setGeneratingReport(true);
    try {
      await downloadMonthlyNaamJapReport(entries, language, user?.user_metadata?.name);
    } catch {
      toast({
        title: HI ? 'त्रुटि' : 'Error',
        description: HI ? 'रिपोर्ट बनाने में विफल। पुनः प्रयास करें।' : 'Could not generate the report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (authLoading) return <LoadingPage />;

  if (!user) {
    return (
      <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
        <Navbar />

        <header
          className="px-5 pt-16 pb-10 text-center"
          style={{ background: 'linear-gradient(180deg, rgba(240,150,50,0.16) 0%, rgba(240,150,50,0.05) 60%, #faf8f5 100%)' }}
        >
          <p className="font-tiro text-5xl text-[#c2410c] select-none">ॐ</p>
          <h1 className="mt-4 font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15]">
            {HI ? 'नाम जप' : 'Naam Jap'}
          </h1>
          <p className="mt-4 max-w-md mx-auto text-[17px] leading-relaxed text-[#241a12]/75">
            {HI
              ? 'अपनी दैनिक साधना को ट्रैक करें और निरंतरता बनाएं।'
              : 'Track your daily practice and build consistency.'}
          </p>
        </header>

        <main className="max-w-sm mx-auto px-5 pb-20 text-center">
          <div className="rounded-3xl bg-white border border-[#241a12]/10 p-7 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#241a12] flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 font-tiro font-normal text-2xl">
              {HI ? 'लॉगिन आवश्यक है' : 'Sign in to continue'}
            </h2>
            <p className="mt-2 text-[15px] text-[#7a6a5c] leading-relaxed">
              {HI
                ? 'अपनी यात्रा को सभी उपकरणों में सुरक्षित रखने के लिए लॉगिन करें।'
                : 'Sign in to keep your streak and count safely synced across devices.'}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link to="/login">
                <button className={`w-full h-12 rounded-full bg-[#ea580c] hover:bg-[#d24e0a] text-white text-[15px] font-semibold transition-colors ${pressable} ${focusRing}`}>
                  {HI ? 'लॉगिन करें' : 'Log in'}
                </button>
              </Link>
              <Link to="/signup">
                <button className={`w-full h-12 rounded-full border border-[#241a12]/15 hover:bg-[#faf8f5] text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 ${pressable} ${focusRing}`}>
                  <UserPlus className="w-4 h-4" />
                  {HI ? 'नया खाता बनाएं' : 'Create an account'}
                </button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  const facts = [
    { label: HI ? 'आज' : 'Today', value: (parseInt(count) || 0).toLocaleString() },
    { label: HI ? 'स्ट्रीक' : 'Streak', value: `${stats.currentStreak}` },
    { label: HI ? 'कुल' : 'Total', value: stats.totalCount.toLocaleString() },
  ];

  return (
    <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
      <Navbar />

      <header
        className="px-5 pt-14 pb-6 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(240,150,50,0.16) 0%, rgba(240,150,50,0.05) 60%, #faf8f5 100%)' }}
      >
        <h1 className="font-tiro font-normal tracking-normal text-[2.4rem] sm:text-5xl leading-[1.15]">
          {HI ? 'नाम जप' : 'Naam Jap'}
        </h1>
        <p className="mt-2 text-[15px] text-[#241a12]/70">
          {new Date().toLocaleDateString(HI ? 'hi-IN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        {!todayEntry && stats.currentStreak > 0 && (
          <p className="mt-3 text-[13px] font-medium text-[#c2410c]">
            {HI
              ? `आपकी ${stats.currentStreak} दिन की स्ट्रीक जारी है — आज की गिनती जोड़ें`
              : `Your ${stats.currentStreak}-day streak is alive — log today’s count`}
          </p>
        )}
      </header>

      <main className="max-w-lg mx-auto px-5 pb-24">
        {/* Mala */}
        <section className="flex flex-col items-center pt-4 pb-2">
          <NaamJapCounter
            initialCount={parseInt(count) || 0}
            onCountChange={newCount => setCount(newCount.toString())}
            language={language}
          />
        </section>

        {/* Quiet fact row */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {facts.map(f => (
            <div key={f.label} className="rounded-2xl bg-white border border-[#241a12]/10 px-3 py-3.5 text-center">
              <dd className="text-[20px] font-semibold leading-snug tabular-nums">{f.value}</dd>
              <dt className="mt-0.5 text-[12px] text-[#7a6a5c]">{f.label}</dt>
            </div>
          ))}
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={generatingReport}
          className={`mt-3 w-full h-11 rounded-full border border-[#241a12]/12 bg-white hover:bg-[#faf3e8] text-[13px] font-medium text-[#241a12] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${pressable} ${focusRing}`}
        >
          {generatingReport ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{HI ? 'रिपोर्ट बन रही है...' : 'Preparing report...'}</>
          ) : (
            <><FileDown className="w-4 h-4 text-[#c2410c]" />{HI ? 'इस महीने की रिपोर्ट (PDF)' : 'This month’s report (PDF)'}</>
          )}
        </button>

        {/* Save form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#7a6a5c] mb-1.5">
              {HI ? 'गिनती' : 'Count'}
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={count}
              onChange={e => setCount(e.target.value)}
              placeholder={HI ? 'जैसे १०८०' : 'e.g. 1080'}
              min="0"
              required
              className={`w-full h-12 rounded-xl bg-white border border-[#241a12]/10 px-4 text-[16px] tabular-nums placeholder:text-[#7a6a5c] focus:outline-none focus:border-[#ea580c]/50 focus:ring-2 focus:ring-[#ea580c]/20`}
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#7a6a5c] mb-1.5">
              {HI ? 'नोट्स (वैकल्पिक)' : 'Notes (optional)'}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={HI ? 'अपने अनुभव के बारे में लिखें...' : 'Write about your experience...'}
              rows={3}
              className="w-full rounded-xl bg-white border border-[#241a12]/10 px-4 py-3 text-[15px] leading-relaxed placeholder:text-[#7a6a5c] focus:outline-none focus:border-[#ea580c]/50 focus:ring-2 focus:ring-[#ea580c]/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full h-12 rounded-full bg-[#241a12] hover:bg-[#3a2b1c] text-white text-[15px] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${pressable} ${focusRing}`}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{HI ? 'सहेजा जा रहा है...' : 'Saving...'}</>
            ) : todayEntry ? (
              <><Check className="w-4 h-4" />{HI ? 'अपडेट करें' : 'Update entry'}</>
            ) : (
              <><Save className="w-4 h-4" />{HI ? 'सहेजें' : 'Save entry'}</>
            )}
          </button>
          <p className="text-center text-[12px] text-[#7a6a5c]">
            {HI ? 'केवल आज की प्रविष्टि संपादित की जा सकती है' : 'Only today’s entry can be edited'}
          </p>
        </form>

        {/* Milestones */}
        <section className="mt-12" aria-labelledby="milestones">
          <h2 id="milestones" className="font-tiro font-normal tracking-normal text-[1.6rem] leading-tight">
            {HI ? 'माइलस्टोन' : 'Milestones'}
          </h2>
          <div className="mt-4 space-y-4">
            {MILESTONES.map(m => {
              const progress = Math.min(100, (stats.totalCount / m.count) * 100);
              const achieved = stats.totalCount >= m.count;
              return (
                <div key={m.count}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className={`font-medium ${achieved ? 'text-[#c2410c]' : 'text-[#241a12]'}`}>
                      {HI ? m.label.hi : m.label.en}
                    </span>
                    <span className="text-[#7a6a5c] tabular-nums">{m.count.toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[#241a12]/8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${achieved ? 'bg-[#c2410c]' : 'bg-[#ea580c]/60'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent entries */}
        {entries.length > 0 && (
          <section className="mt-12" aria-labelledby="recent">
            <h2 id="recent" className="font-tiro font-normal tracking-normal text-[1.6rem] leading-tight">
              {HI ? 'हाल की प्रविष्टियां' : 'Recent entries'}
            </h2>
            <ul className="mt-4 divide-y divide-[#241a12]/8">
              {entries.slice(0, 10).map(entry => (
                <li key={entry.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 pr-4">
                    <p className="text-[15px] font-medium">
                      {parseLocalDate(entry.date).toLocaleDateString(HI ? 'hi-IN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    {entry.notes && <p className="text-[13px] text-[#7a6a5c] truncate mt-0.5">{entry.notes}</p>}
                  </div>
                  <span className="text-[17px] font-semibold text-[#c2410c] tabular-nums flex-shrink-0">
                    {entry.count.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* How it works */}
        <section className="mt-12" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="font-tiro font-normal tracking-normal text-[1.6rem] leading-tight">
            {HI ? 'यह कैसे काम करता है' : 'How it works'}
          </h2>
          <dl className="mt-4 space-y-4">
            {[
              {
                q: HI ? 'केवल आज' : 'Today only',
                a: HI
                  ? 'आप केवल आज की प्रविष्टि जोड़ या बदल सकते हैं। दिन बीतने के बाद वह हमेशा के लिए लॉक हो जाती है।'
                  : 'You can only add or change today’s entry. Once the day passes, it’s locked for good.',
              },
              {
                q: HI ? 'प्रामाणिक स्ट्रीक' : 'Authentic streaks',
                a: HI
                  ? 'पिछली तारीख की एंट्री नहीं जोड़ी जा सकती। एक दिन चूकने पर स्ट्रीक टूट जाती है।'
                  : 'No backdating. Miss a day and the streak breaks — this keeps it an honest record of daily practice.',
              },
            ].map(item => (
              <div key={item.q}>
                <dt className="text-[15px] font-semibold">{item.q}</dt>
                <dd className="mt-1 text-[14px] text-[#7a6a5c] leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <Footer />
    </div>
  );
}
