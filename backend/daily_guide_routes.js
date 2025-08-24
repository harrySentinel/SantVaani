// Daily Guide API Routes - ADD THESE TO YOUR EXISTING server.js
// These routes extend your current functionality without breaking anything

// Add this after your existing YouTube API setup in server.js
// Just copy-paste the routes section at the bottom

// ===================================
// DAILY GUIDE API ROUTES
// ===================================

// Initialize Supabase client (add this at top of server.js after other imports)
/*
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
*/

// 1. QUOTES API - EXTENDED (won't break existing quotes)
app.get('/api/quotes/daily-guide', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('is_daily_guide', true)
      .order('display_priority', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Return today's quote (rotate based on day)
    const today = new Date().getDay();
    const todaysQuote = data[today % data.length];

    res.json({
      success: true,
      todaysQuote,
      allQuotes: data
    });
  } catch (error) {
    console.error('Daily Guide quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily guide quotes',
      error: error.message
    });
  }
});

// 2. MANTRAS API
app.get('/api/mantras/today', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mantras')
      .select('*')
      .eq('is_active', true)
      .order('display_priority', { ascending: false });

    if (error) throw error;

    // Return today's mantra (rotate based on day)
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

// 3. FESTIVALS API
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

    // Calculate days left for each festival
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

// 4. PANCHANG API
app.get('/api/panchang/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let { data, error } = await supabase
      .from('panchang')
      .select('*')
      .eq('date', today)
      .single();

    // If no data for today, return mock data (for now)
    if (!data || error) {
      data = {
        date: today,
        tithi: 'Shukla Tritiya',
        tithi_hi: 'शुक्ल त्रितीया',
        nakshatra: 'Rohini',
        nakshatra_hi: 'रोहिणी',
        yoga: 'Shukla',
        yoga_hi: 'शुक्ल',
        karana: 'Bava',
        karana_hi: 'बव',
        sunrise: '06:15:00',
        sunset: '18:45:00',
        moonrise: '09:30:00',
        moonset: '20:45:00',
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

// 5. HOROSCOPE API
app.get('/api/horoscope/:zodiacSign/:period', async (req, res) => {
  try {
    const { zodiacSign, period } = req.params;
    const today = new Date().toISOString().split('T')[0];

    let { data, error } = await supabase
      .from('horoscope')
      .select('*')
      .eq('zodiac_sign', zodiacSign.toLowerCase())
      .eq('period', period.toLowerCase())
      .eq('date', today)
      .eq('is_active', true)
      .single();

    // If no data, return sample horoscope
    if (!data || error) {
      data = {
        zodiac_sign: zodiacSign.toLowerCase(),
        date: today,
        period: period.toLowerCase(),
        prediction: `Today brings positive energy for ${zodiacSign}. Focus on spiritual growth and inner peace.`,
        prediction_hi: `आज ${zodiacSign} के लिए सकारात्मक ऊर्जा लेकर आया है। आध्यात्मिक विकास और आंतरिक शांति पर ध्यान दें।`,
        love_score: 4,
        career_score: 3,
        health_score: 4,
        money_score: 3,
        lucky_color: 'Orange',
        lucky_number: 7
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

// 6. COMPREHENSIVE DAILY GUIDE DATA (ONE API CALL)
app.get('/api/daily-guide/today', async (req, res) => {
  try {
    // Fetch all data in parallel for better performance
    const [quotesResult, mantrasResult, festivalsResult, panchangResult] = await Promise.all([
      supabase.from('quotes').select('*').eq('is_daily_guide', true).order('display_priority', { ascending: false }).limit(5),
      supabase.from('mantras').select('*').eq('is_active', true).order('display_priority', { ascending: false }).limit(5),
      supabase.from('festivals').select('*').eq('is_active', true).gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(5),
      supabase.from('panchang').select('*').eq('date', new Date().toISOString().split('T')[0]).single()
    ]);

    const today = new Date().getDay();
    
    // Get today's content (rotate based on day)
    const todaysQuote = quotesResult.data?.[today % (quotesResult.data?.length || 1)];
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
        todaysQuote,
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
    console.error('Daily Guide comprehensive API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily guide data',
      error: error.message
    });
  }
});

// ===================================
// ADD THESE ROUTES TO YOUR EXISTING server.js
// Place them BEFORE your existing routes, after middleware setup
// ===================================