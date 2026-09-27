export type DayPeriod = 'brahma' | 'morning' | 'midday' | 'dusk' | 'night';

export const getDayPeriod = (d = new Date()): DayPeriod => {
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= 210 && m < 360) return 'brahma';
  if (m >= 360 && m < 660) return 'morning';
  if (m >= 660 && m < 960) return 'midday';
  if (m >= 960 && m < 1170) return 'dusk';
  return 'night';
};

interface PeriodStyle {
  hi: string;
  en: string;
  lineHi: string;
  lineEn: string;
  /** Light sky for the page header. */
  sky: [string, string];
  /** Deep sky for the full-screen chanting mode. */
  deep: [string, string];
  /** The sun or moon sitting in that sky. */
  orb: { color: string; top: string };
}

export const PERIODS: Record<DayPeriod, PeriodStyle> = {
  brahma: {
    hi: 'ब्रह्म मुहूर्त',
    en: 'Brahma muhurta',
    lineHi: 'जप का सबसे शुभ समय',
    lineEn: 'The most auspicious hour for japa',
    sky: ['#ecd6e4', '#fbe9de'],
    deep: ['#2b2140', '#6e4058'],
    orb: { color: '#fff4f1', top: '58%' },
  },
  morning: {
    hi: 'शुभ प्रभात',
    en: 'Good morning',
    lineHi: 'दिन की शुरुआत नाम से',
    lineEn: 'Begin the day with the Name',
    sky: ['#fddcb9', '#fbf0e2'],
    deep: ['#4a2210', '#b35a24'],
    orb: { color: '#ffd592', top: '20%' },
  },
  midday: {
    hi: 'मध्याह्न',
    en: 'Midday',
    lineHi: 'एक माला, एक विराम',
    lineEn: 'One mala, one pause',
    sky: ['#fbe9c8', '#faf5ec'],
    deep: ['#46301a', '#9c6a2c'],
    orb: { color: '#fff1bf', top: '8%' },
  },
  dusk: {
    hi: 'संध्या',
    en: 'Evening',
    lineHi: 'संध्या वंदन का समय',
    lineEn: 'Time for evening prayer',
    sky: ['#f5c08c', '#fbe4cc'],
    deep: ['#3d170b', '#a8431a'],
    orb: { color: '#ff9b5c', top: '52%' },
  },
  night: {
    hi: 'शुभ रात्रि',
    en: 'Good night',
    lineHi: 'सोने से पहले एक माला',
    lineEn: 'One mala before sleep',
    sky: ['#d9d3ea', '#f1ecf2'],
    deep: ['#171429', '#35294d'],
    orb: { color: '#f6f3ff', top: '14%' },
  },
};
