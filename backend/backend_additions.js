// ===================================
// ADD THESE TO YOUR server.js
// ===================================

// 1. ADD THIS AT THE TOP (after other requires)
const { createClient } = require('@supabase/supabase-js');

// 2. ADD THIS AFTER YOUR OTHER CONFIGURATIONS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 3. ADD THESE API ROUTES BEFORE YOUR EXISTING ROUTES

// ===================================
// HOROSCOPE APIs
// ===================================

// Get daily horoscope for a zodiac sign
app.get('/api/horoscope/:zodiacSign', async (req, res) => {
  try {
    const { zodiacSign } = req.params;
    const today = new Date().toISOString().split('T')[0];

    let { data, error } = await supabase
      .from('horoscope')
      .select('*')
      .eq('zodiac_sign', zodiacSign.toLowerCase())
      .eq('date', today)
      .eq('period', 'daily')
      .single();

    // If no data found, create sample prediction
    if (!data || error) {
      data = {
        zodiac_sign: zodiacSign.toLowerCase(),
        date: today,
        period: 'daily',
        prediction: `Today brings positive energy for ${zodiacSign}. Focus on spiritual growth and inner peace.`,
        prediction_hi: `आज ${zodiacSign} के लिए सकारात्मक ऊर्जा है। आध्यात्मिक विकास पर ध्यान दें।`,
        love_score: Math.floor(Math.random() * 5) + 1,
        career_score: Math.floor(Math.random() * 5) + 1,
        health_score: Math.floor(Math.random() * 5) + 1,
        money_score: Math.floor(Math.random() * 5) + 1,
        lucky_color: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'][Math.floor(Math.random() * 5)],
        lucky_number: Math.floor(Math.random() * 9) + 1
      };
    }

    res.json({
      success: true,
      horoscope: data
    });
  } catch (error) {
    console.error('Horoscope API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch horoscope',
      error: error.message
    });
  }
});

// Get all zodiac signs list
app.get('/api/horoscope/zodiac/list', (req, res) => {
  const zodiacSigns = [
    { 
      id: 'aries', 
      name: 'Aries', 
      nameHi: 'मेष', 
      symbol: '♈', 
      dates: 'Mar 21 - Apr 19',
      element: 'Fire',
      planet: 'Mars'
    },
    { 
      id: 'taurus', 
      name: 'Taurus', 
      nameHi: 'वृषभ', 
      symbol: '♉', 
      dates: 'Apr 20 - May 20',
      element: 'Earth',
      planet: 'Venus'
    },
    { 
      id: 'gemini', 
      name: 'Gemini', 
      nameHi: 'मिथुन', 
      symbol: '♊', 
      dates: 'May 21 - Jun 20',
      element: 'Air',
      planet: 'Mercury'
    },
    { 
      id: 'cancer', 
      name: 'Cancer', 
      nameHi: 'कर्क', 
      symbol: '♋', 
      dates: 'Jun 21 - Jul 22',
      element: 'Water',
      planet: 'Moon'
    },
    { 
      id: 'leo', 
      name: 'Leo', 
      nameHi: 'सिंह', 
      symbol: '♌', 
      dates: 'Jul 23 - Aug 22',
      element: 'Fire',
      planet: 'Sun'
    },
    { 
      id: 'virgo', 
      name: 'Virgo', 
      nameHi: 'कन्या', 
      symbol: '♍', 
      dates: 'Aug 23 - Sep 22',
      element: 'Earth',
      planet: 'Mercury'
    },
    { 
      id: 'libra', 
      name: 'Libra', 
      nameHi: 'तुला', 
      symbol: '♎', 
      dates: 'Sep 23 - Oct 22',
      element: 'Air',
      planet: 'Venus'
    },
    { 
      id: 'scorpio', 
      name: 'Scorpio', 
      nameHi: 'वृश्चिक', 
      symbol: '♏', 
      dates: 'Oct 23 - Nov 21',
      element: 'Water',
      planet: 'Mars'
    },
    { 
      id: 'sagittarius', 
      name: 'Sagittarius', 
      nameHi: 'धनु', 
      symbol: '♐', 
      dates: 'Nov 22 - Dec 21',
      element: 'Fire',
      planet: 'Jupiter'
    },
    { 
      id: 'capricorn', 
      name: 'Capricorn', 
      nameHi: 'मकर', 
      symbol: '♑', 
      dates: 'Dec 22 - Jan 19',
      element: 'Earth',
      planet: 'Saturn'
    },
    { 
      id: 'aquarius', 
      name: 'Aquarius', 
      nameHi: 'कुम्भ', 
      symbol: '♒', 
      dates: 'Jan 20 - Feb 18',
      element: 'Air',
      planet: 'Saturn'
    },
    { 
      id: 'pisces', 
      name: 'Pisces', 
      nameHi: 'मीन', 
      symbol: '♓', 
      dates: 'Feb 19 - Mar 20',
      element: 'Water',
      planet: 'Jupiter'
    }
  ];

  res.json({
    success: true,
    zodiacSigns
  });
});

// ===================================
// MANTRAS API
// ===================================

app.get('/api/mantras/today', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mantras')
      .select('*')
      .eq('is_active', true)
      .order('display_priority', { ascending: false });

    if (error) throw error;

    // Get today's mantra (rotate based on day of week)
    const today = new Date().getDay();
    const todaysMantra = data[today % data.length];

    res.json({
      success: true,
      todaysMantra,
      allMantras: data
    });
  } catch (error) {
    console.error('Mantras API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mantras',
      error: error.message
    });
  }
});

// ===================================
// FESTIVALS API
// ===================================

app.get('/api/festivals/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('is_active', true)
      .gte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(10);

    if (error) throw error;

    // Calculate days left
    const festivalsWithDaysLeft = data.map(festival => {
      const festivalDate = new Date(festival.date);
      const diffTime = festivalDate - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        ...festival,
        daysLeft: daysLeft >= 0 ? daysLeft : 0
      };
    });

    res.json({
      success: true,
      festivals: festivalsWithDaysLeft
    });
  } catch (error) {
    console.error('Festivals API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch festivals',
      error: error.message
    });
  }
});

// ===================================
// PANCHANG API
// ===================================

app.get('/api/panchang/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let { data, error } = await supabase
      .from('panchang')
      .select('*')
      .eq('date', today)
      .single();

    // If no data, return sample data
    if (!data || error) {
      data = {
        date: today,
        tithi: 'Shukla Tritiya',
        tithi_hi: 'शुक्ल त्रितीया',
        nakshatra: 'Rohini',
        nakshatra_hi: 'रोहिणी',
        sunrise: '06:15:00',
        sunset: '18:45:00',
        muhurat_start: '08:30:00',
        muhurat_end: '09:15:00'
      };
    }

    res.json({
      success: true,
      panchang: data
    });
  } catch (error) {
    console.error('Panchang API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch panchang',
      error: error.message
    });
  }
});

// ===================================
// COMPREHENSIVE DAILY GUIDE API
// ===================================

app.get('/api/daily-guide/complete', async (req, res) => {
  try {
    const [mantrasResult, festivalsResult, panchangResult] = await Promise.all([
      supabase.from('mantras').select('*').eq('is_active', true).limit(5),
      supabase.from('festivals').select('*').eq('is_active', true).gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(5),
      supabase.from('panchang').select('*').eq('date', new Date().toISOString().split('T')[0]).single()
    ]);

    const today = new Date().getDay();
    const todaysMantra = mantrasResult.data?.[today % (mantrasResult.data?.length || 1)];

    // Calculate days left for festivals
    const festivalsWithDaysLeft = festivalsResult.data?.map(festival => {
      const festivalDate = new Date(festival.date);
      const diffTime = festivalDate - new Date();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...festival, daysLeft: daysLeft >= 0 ? daysLeft : 0 };
    }) || [];

    res.json({
      success: true,
      data: {
        todaysMantra,
        upcomingFestivals: festivalsWithDaysLeft,
        panchang: panchangResult.data || {
          date: new Date().toISOString().split('T')[0],
          tithi: 'Shukla Tritiya',
          nakshatra: 'Rohini',
          sunrise: '06:15:00',
          sunset: '18:45:00'
        }
      }
    });
  } catch (error) {
    console.error('Complete daily guide API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily guide data',
      error: error.message
    });
  }
});

// ===================================
// PLACE ALL OF ABOVE BEFORE YOUR EXISTING ROUTES
// ===================================