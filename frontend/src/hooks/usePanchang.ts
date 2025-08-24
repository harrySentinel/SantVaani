import { useState, useEffect } from 'react';

export interface PanchangData {
  date: string;
  dateHi: string;
  tithi: string;
  tithiHi: string;
  nakshatra: string;
  nakshatraHi: string;
  yoga: string;
  yogaHi: string;
  karana: string;
  karanaHi: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  muhurat: string;
  muhuratHi: string;
  rahu: string;
  yama: string;
  gulika: string;
}

export const usePanchang = () => {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanchang = async () => {
      try {
        setLoading(true);
        
        // Mock data for now - in production, you'd fetch from a real Panchang API
        const mockPanchangData: PanchangData = {
          date: new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          dateHi: 'कार्तिक शुक्ल त्रितीया',
          tithi: 'Shukla Tritiya',
          tithiHi: 'शुक्ल त्रितीया',
          nakshatra: 'Rohini',
          nakshatraHi: 'रोहिणी',
          yoga: 'Shukla',
          yogaHi: 'शुक्ल',
          karana: 'Bava',
          karanaHi: 'बव',
          sunrise: '6:15 AM',
          sunset: '6:45 PM',
          moonrise: '9:30 AM',
          moonset: '8:45 PM',
          muhurat: '8:30 AM - 9:15 AM',
          muhuratHi: 'प्रातः 8:30 - 9:15',
          rahu: '4:30 PM - 6:00 PM',
          yama: '10:30 AM - 12:00 PM',
          gulika: '1:30 PM - 3:00 PM'
        };

        // Simulate API call delay
        setTimeout(() => {
          setPanchang(mockPanchangData);
          setLoading(false);
        }, 1000);

      } catch (err) {
        setError('Failed to load Panchang data');
        setLoading(false);
      }
    };

    fetchPanchang();
  }, []);

  const getCurrentMuhurat = () => {
    if (!panchang) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    // Check if current time is within muhurat
    if (currentTime >= 830 && currentTime <= 915) {
      return {
        active: true,
        timeLeft: 915 - currentTime,
        message: 'Auspicious time ongoing!'
      };
    }
    
    return {
      active: false,
      nextMuhurat: '8:30 AM tomorrow',
      message: 'Next auspicious time'
    };
  };

  const getVratInfo = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Mock vrat data based on day of week
    const vratMap: Record<number, { name: string, nameHi: string, description: string }> = {
      0: { name: 'Somvar Vrat', nameHi: 'सोमवार व्रत', description: 'Fast dedicated to Lord Shiva' },
      1: { name: 'Mangalwar Vrat', nameHi: 'मंगलवार व्रत', description: 'Fast for Hanuman Ji' },
      2: { name: 'Budhvar Vrat', nameHi: 'बुधवार व्रत', description: 'Fast for Lord Ganesha' },
      3: { name: 'Guruvaar Vrat', nameHi: 'गुरुवार व्रत', description: 'Fast for Guru (Jupiter)' },
      4: { name: 'Shukravar Vrat', nameHi: 'शुक्रवार व्रत', description: 'Fast for Goddess Lakshmi' },
      5: { name: 'Shanivar Vrat', nameHi: 'शनिवार व्रत', description: 'Fast for Lord Shani' },
      6: { name: 'Ravivar Vrat', nameHi: 'रविवार व्रत', description: 'Fast for Lord Surya' }
    };
    
    return vratMap[dayOfWeek] || null;
  };

  return {
    panchang,
    loading,
    error,
    getCurrentMuhurat,
    getVratInfo,
    refetch: () => {
      setLoading(true);
      // Trigger re-fetch
    }
  };
};