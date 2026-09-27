'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Check, CloudOff, FileDown, Flame, Loader2, LogIn, Moon, Sun, Sunrise, Sunset, UserPlus } from 'lucide-react';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import Link from '@/components/SiteLink';
import NaamJapCounter from '@/components/naam-jap/NaamJapCounter';
import { getDayPeriod, PERIODS, type DayPeriod } from '@/components/naam-jap/timeOfDay';
import { downloadMonthlyNaamJapReport } from '@/utils/naamJapReport';

interface NaamJapEntry {
  id: string;
  user_id: string;
  date: string;
  count: number;
  notes?: string | null;
  created_at: string;
}

type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';
const pressable = 'transition-transform duration-150 active:scale-[0.97]';

const MILESTONES = [
  { count: 10000, label: { hi: 'समर्पित', en: 'Dedicated' } },
  { count: 50000, label: { hi: 'प्रतिबद्ध', en: 'Committed' } },
  { count: 100000, label: { hi: 'भक्त', en: 'Devoted' } },
  { count: 1000000, label: { hi: 'प्रबुद्ध', en: 'Enlightened' } },
];

const PERIOD_ICON = { brahma: Sunrise, morning: Sun, midday: Sun, dusk: Sunset, night: Moon } as const;

// entry.date is a plain "YYYY-MM-DD" string. `new Date(dateString)` parses that as UTC
// midnight, then .getMonth()/.getDate() read it back in local time — which silently
// shifts the date by a day for anyone not in UTC. Parse and format from local parts instead.
const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

function computeStats(entries: NaamJapEntry[], todayDate: string) {
  const active = entries.filter(e => e.count > 0);
  const dates = new Set(active.map(e => e.date));
  const totalCount = active.reduce((s, e) => s + e.count, 0);

  // A streak isn't broken until the day is over: if today isn't logged yet, count from yesterday.
  let currentStreak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (!dates.has(toLocalDateStr(d))) d.setDate(d.getDate() - 1);
  while (dates.has(toLocalDateStr(d))) {
    currentStreak++;
    d.setDate(d.getDate() - 1);
  }

  let longestStreak = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const ds of [...dates].sort()) {
    const cur = parseLocalDate(ds);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    prev = cur;
  }

  return { totalCount, currentStreak, longestStreak, todayDone: dates.has(todayDate) };
}

export default function NaamJapTracker() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const HI = language === 'HI';

  const todayDate = toLocalDateStr(new Date());
  const [period, setPeriod] = useState<DayPeriod>(() => getDayPeriod());
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState<NaamJapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [generatingReport, setGeneratingReport] = useState(false);

  const syncedRef = useRef(false);
  const todayIdRef = useRef<string | null>(null);
  const lastSavedRef = useRef({ count: 0, notes: '' });
  const latestRef = useRef({ count: 0, notes: '' });
  const chainRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    latestRef.current = { count, notes };
  }, [count, notes]);

  const stats = useMemo(() => computeStats(entries, todayDate), [entries, todayDate]);

  useEffect(() => {
    const t = setInterval(() => setPeriod(getDayPeriod()), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('naam_jap_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (cancelled) return;
      if (error) {
        toast({ title: HI ? 'त्रुटि' : 'Error', description: HI ? 'एंट्रीज़ लोड करने में विफल' : 'Failed to load entries', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const rows = (data ?? []) as NaamJapEntry[];
      setEntries(rows);
      if (!syncedRef.current) {
        const today = rows.find(e => e.date === todayDate);
        todayIdRef.current = today?.id ?? null;
        lastSavedRef.current = { count: today?.count ?? 0, notes: today?.notes ?? '' };
        setCount(today?.count ?? 0);
        setNotes(today?.notes ?? '');
        syncedRef.current = true;
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const doSave = async (c: number, n: string) => {
    if (!user) return;
    const last = lastSavedRef.current;
    if (last.count === c && last.notes === n) { setSaveState('saved'); return; }
    setSaveState('saving');
    try {
      const payload = { user_id: user.id, date: todayDate, count: c, notes: n.trim() || null };
      const { data, error } = todayIdRef.current
        ? await supabase.from('naam_jap_entries').update(payload).eq('id', todayIdRef.current).select().single()
        : await supabase.from('naam_jap_entries').insert([payload]).select().single();
      if (error) throw error;
      const saved = data as NaamJapEntry;
      todayIdRef.current = saved.id;
      lastSavedRef.current = { count: c, notes: n };
      setEntries(prev => [saved, ...prev.filter(e => e.id !== saved.id && e.date !== saved.date)]);
      const cur = latestRef.current;
      setSaveState(cur.count === c && cur.notes === n ? 'saved' : 'pending');
    } catch {
      setSaveState('error');
    }
  };

  // Saves run one after another so a fast second save never creates a duplicate row.
  const persist = (c: number, n: string) => {
    const job = chainRef.current.then(() => doSave(c, n));
    chainRef.current = job.catch(() => {});
    return job;
  };

  // Auto-save: a moment after the count or notes settle.
  useEffect(() => {
    if (!user || !syncedRef.current) return;
    const last = lastSavedRef.current;
    if (last.count === count && last.notes === notes) return;
    setSaveState('pending');
    const t = setTimeout(() => { void persist(count, notes); }, 1200);
    return () => clearTimeout(t);
  }, [count, notes, user]);

  // Leaving the app mid-chant shouldn't lose the last few beads.
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState !== 'hidden' || !syncedRef.current) return;
      const { count: c, notes: n } = latestRef.current;
      const last = lastSavedRef.current;
      if (last.count !== c || last.notes !== n) void persist(c, n);
    };
    document.addEventListener('visibilitychange', flush);
    return () => document.removeEventListener('visibilitychange', flush);
  }, [user]);

  const savedToday = entries.find(e => e.date === todayDate)?.count ?? 0;
  const liveTotal = stats.totalCount - savedToday + count;
  const liveStreak = stats.currentStreak + (count > 0 && !stats.todayDone ? 1 : 0);

  const week = useMemo(
    () =>
      Array.from({ length: 7 }, (_, k) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (6 - k));
        const ds = toLocalDateStr(d);
        const c = ds === todayDate ? count : entries.find(e => e.date === ds)?.count ?? 0;
        return { ds, c, isToday: ds === todayDate, label: d.toLocaleDateString(HI ? 'hi-IN' : 'en-US', { weekday: 'narrow' }) };
      }),
    [entries, count, todayDate, HI],
  );
  const weekMax = Math.max(108, ...week.map(w => w.c));
  const weekTotal = week.reduce((s, w) => s + w.c, 0);

  const handleDownloadReport = async () => {
    setGeneratingReport(true);
    try {
      const reportEntries = [
        ...entries.filter(e => e.date !== todayDate).map(e => ({ date: e.date, count: e.count, notes: e.notes ?? undefined })),
        ...(count > 0 ? [{ date: todayDate, count, notes }] : []),
      ];
      await downloadMonthlyNaamJapReport(reportEntries, language, user?.user_metadata?.name);
    } catch {
      toast({ title: HI ? 'त्रुटि' : 'Error', description: HI ? 'रिपोर्ट बनाने में विफल। पुनः प्रयास करें।' : 'Could not generate the report. Please try again.', variant: 'destructive' });
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
          <h1 className="mt-4 font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15]">{HI ? 'नाम जप' : 'Naam Jap'}</h1>
          <p className="mt-4 max-w-md mx-auto text-[17px] leading-relaxed text-[#241a12]/75">
            {HI ? 'अपनी दैनिक साधना को ट्रैक करें और निरंतरता बनाएं।' : 'Track your daily practice and build consistency.'}
          </p>
        </header>
        <main className="max-w-sm mx-auto px-5 pb-20 text-center">
          <div className="rounded-3xl bg-white border border-[#241a12]/10 p-7 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#241a12] flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 font-tiro font-normal text-2xl">{HI ? 'लॉगिन आवश्यक है' : 'Sign in to continue'}</h2>
            <p className="mt-2 text-[15px] text-[#7a6a5c] leading-relaxed">
              {HI ? 'अपनी यात्रा को सभी उपकरणों में सुरक्षित रखने के लिए लॉगिन करें।' : 'Sign in to keep your streak and count safely synced across devices.'}
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

  const P = PERIODS[period];
  const PeriodIcon = PERIOD_ICON[period];
  const weekday = new Date().toLocaleDateString(HI ? 'hi-IN' : 'en-US', { weekday: 'long' });
  const nextMilestone = MILESTONES.find(m => liveTotal < m.count);

  return (
    <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
      <Navbar />

      <header
        className="relative overflow-hidden px-5 pt-10 pb-10 text-center transition-[background] duration-1000"
        style={{ background: `linear-gradient(180deg, ${P.sky[0]} 0%, ${P.sky[1]} 70%, #faf8f5 100%)` }}
      >
        <div
          aria-hidden="true"
          className="absolute right-[12%] w-20 h-20 rounded-full animate-[naamjapDrift_6s_ease-in-out_infinite_alternate]"
          style={{ top: P.orb.top, background: `radial-gradient(circle, ${P.orb.color} 0%, ${P.orb.color}00 70%)` }}
        />
        <p className="relative inline-flex items-center gap-1.5 rounded-full bg-white/55 backdrop-blur px-3 py-1 text-[13px] font-medium text-[#7a3f1c]">
          <PeriodIcon className="w-3.5 h-3.5" />
          {HI ? P.hi : P.en} · {weekday}
        </p>
        <h1 className="relative mt-3 font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.1]">
          {HI ? 'नाम जप' : 'Naam Jap'}
        </h1>
        <p className="relative mt-1.5 text-[15px] text-[#241a12]/70">{HI ? P.lineHi : P.lineEn}</p>
        {!stats.todayDone && count === 0 && stats.currentStreak > 0 && (
          <p className="relative mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#c2410c]">
            <Flame className="w-3.5 h-3.5" />
            {HI ? `${stats.currentStreak} दिन की स्ट्रीक — आज की माला बाकी है` : `${stats.currentStreak}-day streak — today’s mala is waiting`}
          </p>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-5 pb-24 -mt-3">
        <NaamJapCounter count={count} onCountChange={setCount} language={language} period={period} />

        {/* Auto-save status */}
        <div className="mt-3 h-5 flex items-center justify-center text-[12px] text-[#7a6a5c]">
          {saveState === 'saving' || saveState === 'pending' ? (
            <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" />{HI ? 'सहेज रहे हैं…' : 'Saving…'}</span>
          ) : saveState === 'error' ? (
            <button onClick={() => void persist(count, notes)} className="inline-flex items-center gap-1.5 text-[#c2410c] font-medium">
              <CloudOff className="w-3.5 h-3.5" />{HI ? 'सहेजा नहीं जा सका — फिर कोशिश करें' : 'Couldn’t save — tap to retry'}
            </button>
          ) : todayIdRef.current ? (
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#15803d]" />{HI ? 'अपने आप सहेजा गया' : 'Saved automatically'}</span>
          ) : null}
        </div>

        {/* The week, strung as beads */}
        <section className="mt-8" aria-labelledby="week">
          <div className="flex items-baseline justify-between">
            <h2 id="week" className="font-tiro font-normal tracking-normal text-[1.5rem] leading-tight">{HI ? 'यह सप्ताह' : 'This week'}</h2>
            <span className="text-[13px] text-[#7a6a5c] tabular-nums">{weekTotal.toLocaleString('en-IN')} {HI ? 'जप' : 'chants'}</span>
          </div>
          <div className="relative mt-5">
            <div className="absolute left-[7%] right-[7%] top-[18px] h-px bg-[#241a12]/15" />
            <ol className="relative grid grid-cols-7">
              {week.map(w => {
                const s = w.c ? 14 + 22 * Math.sqrt(w.c / weekMax) : 10;
                return (
                  <li key={w.ds} className="flex flex-col items-center">
                    <div className="h-9 flex items-center justify-center">
                      <span
                        className="block rounded-full transition-all duration-500"
                        style={{
                          width: s,
                          height: s,
                          background: w.c
                            ? 'radial-gradient(circle at 35% 30%, #c47650, #7c3a1d)'
                            : 'radial-gradient(circle at 35% 30%, #f1e2c8, #d9bf94)',
                          boxShadow: w.c ? '0 1px 2px rgba(36,26,18,0.35)' : undefined,
                          outline: w.isToday ? '2px solid rgba(234,88,12,0.35)' : undefined,
                          outlineOffset: 2,
                        }}
                      />
                    </div>
                    <span className={`mt-2 text-[11px] ${w.isToday ? 'text-[#c2410c] font-semibold' : 'text-[#7a6a5c]'}`}>{w.label}</span>
                    <span className="text-[10px] text-[#7a6a5c]/80 tabular-nums">{w.c ? compact(w.c) : '·'}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Facts */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: HI ? 'आज' : 'Today', value: count.toLocaleString('en-IN') },
            { label: HI ? 'दिन की स्ट्रीक' : 'Day streak', value: String(liveStreak) },
            { label: HI ? 'कुल जप' : 'All time', value: liveTotal.toLocaleString('en-IN') },
          ].map(f => (
            <div key={f.label} className="rounded-2xl bg-white border border-[#241a12]/[0.08] px-3 py-3.5 text-center">
              <p className="font-tiro text-[22px] leading-snug tabular-nums">{f.value}</p>
              <p className="mt-0.5 text-[12px] text-[#7a6a5c]">{f.label}</p>
            </div>
          ))}
        </div>

        {/* Reflection + exact count */}
        <section className="mt-8 rounded-3xl bg-white border border-[#241a12]/[0.08] p-5" aria-labelledby="reflection">
          <h2 id="reflection" className="font-tiro font-normal tracking-normal text-[1.35rem] leading-tight">
            {HI ? 'आज का अनुभव' : 'Today’s reflection'}
          </h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={HI ? 'मन कैसा रहा? एक पंक्ति लिखें…' : 'How did it feel? A line is enough…'}
            rows={3}
            className="mt-3 w-full rounded-xl bg-[#faf8f5] border border-[#241a12]/10 px-4 py-3 text-[15px] leading-relaxed placeholder:text-[#7a6a5c] focus:outline-none focus:border-[#ea580c]/50 focus:ring-2 focus:ring-[#ea580c]/20 resize-none"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <label htmlFor="exact-count" className="text-[13px] text-[#7a6a5c]">
              {HI ? 'माला पर गिना? संख्या लिखें' : 'Counted on beads? Type it in'}
            </label>
            <input
              id="exact-count"
              type="number"
              inputMode="numeric"
              min={0}
              value={count || ''}
              onChange={e => setCount(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-28 h-10 rounded-xl bg-[#faf8f5] border border-[#241a12]/10 px-3 text-right text-[16px] tabular-nums focus:outline-none focus:border-[#ea580c]/50 focus:ring-2 focus:ring-[#ea580c]/20"
            />
          </div>
        </section>

        <button
          onClick={handleDownloadReport}
          disabled={generatingReport}
          className={`mt-4 w-full h-11 rounded-full border border-[#241a12]/12 bg-white hover:bg-[#faf3e8] text-[13px] font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${pressable} ${focusRing}`}
        >
          {generatingReport ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{HI ? 'रिपोर्ट बन रही है…' : 'Preparing report…'}</>
          ) : (
            <><FileDown className="w-4 h-4 text-[#c2410c]" />{HI ? 'इस महीने की रिपोर्ट (PDF)' : 'This month’s report (PDF)'}</>
          )}
        </button>

        {/* Milestones */}
        <section className="mt-12" aria-labelledby="milestones">
          <h2 id="milestones" className="font-tiro font-normal tracking-normal text-[1.5rem] leading-tight">{HI ? 'पड़ाव' : 'Milestones'}</h2>
          {nextMilestone && (
            <p className="mt-1 text-[13px] text-[#7a6a5c]">
              {HI
                ? `अगला पड़ाव "${nextMilestone.label.hi}" — ${(nextMilestone.count - liveTotal).toLocaleString('en-IN')} जप दूर`
                : `Next: "${nextMilestone.label.en}" — ${(nextMilestone.count - liveTotal).toLocaleString('en-IN')} to go`}
            </p>
          )}
          <div className="mt-4 space-y-4">
            {MILESTONES.map(m => {
              const progress = Math.min(100, (liveTotal / m.count) * 100);
              const achieved = liveTotal >= m.count;
              return (
                <div key={m.count}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className={`font-medium ${achieved ? 'text-[#c2410c]' : ''}`}>{achieved ? '✓ ' : ''}{HI ? m.label.hi : m.label.en}</span>
                    <span className="text-[#7a6a5c] tabular-nums">{m.count.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[#241a12]/[0.08] overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${achieved ? 'bg-[#c2410c]' : 'bg-[#ea580c]/60'}`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent entries */}
        {entries.some(e => e.count > 0) && (
          <section className="mt-12" aria-labelledby="recent">
            <h2 id="recent" className="font-tiro font-normal tracking-normal text-[1.5rem] leading-tight">{HI ? 'हाल की प्रविष्टियां' : 'Recent days'}</h2>
            <ul className="mt-4 divide-y divide-[#241a12]/[0.08]">
              {entries.filter(e => e.count > 0).slice(0, 10).map(entry => (
                <li key={entry.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 pr-4">
                    <p className="text-[15px] font-medium">
                      {parseLocalDate(entry.date).toLocaleDateString(HI ? 'hi-IN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    {entry.notes && <p className="text-[13px] text-[#7a6a5c] truncate mt-0.5">{entry.notes}</p>}
                  </div>
                  <span className="font-tiro text-[18px] text-[#c2410c] tabular-nums flex-shrink-0">{entry.count.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* How it works */}
        <section className="mt-12" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="font-tiro font-normal tracking-normal text-[1.5rem] leading-tight">{HI ? 'यह कैसे काम करता है' : 'How it works'}</h2>
          <dl className="mt-4 space-y-4">
            {[
              {
                q: HI ? 'माला को छुएं या जप मोड खोलें' : 'Touch the mala, or open chanting mode',
                a: HI
                  ? 'हर स्पर्श पर एक मनका आगे बढ़ता है। जप मोड में पूरी स्क्रीन पर कहीं भी टैप करें — आँखें बंद करके भी।'
                  : 'Each touch moves one bead past the thumb. In chanting mode, tap anywhere on the screen — even with your eyes closed.',
              },
              {
                q: HI ? 'अपने आप सहेजा जाता है' : 'Saved automatically',
                a: HI
                  ? 'आपकी गिनती और अनुभव अपने आप सहेजे जाते हैं। केवल आज की प्रविष्टि बदली जा सकती है।'
                  : 'Your count and reflection save on their own. Only today’s entry can be changed.',
              },
              {
                q: HI ? 'प्रामाणिक स्ट्रीक' : 'Honest streaks',
                a: HI
                  ? 'पिछली तारीख की एंट्री नहीं जोड़ी जा सकती। एक दिन चूकने पर स्ट्रीक टूट जाती है।'
                  : 'No backdating. Miss a day and the streak breaks — an honest record of daily practice.',
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
