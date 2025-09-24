const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');
const {
  registerFCMToken,
  scheduleNotifications,
  sendTestNotification,
  getNotificationStats
} = require('./fcm_scheduler');
const {
  getTodaysPanchang,
  fetchRealPanchangData
} = require('./panchang_service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
); 

// In-memory cache to store bhajan data
let bhajanCache = {
  data: null,
  lastUpdated: null,
  isUpdating: false
};

// Cache duration from env (default 6 hours)
const CACHE_DURATION = (process.env.CACHE_DURATION_HOURS || 6) * 60 * 60 * 1000;

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Bhajan-related search terms and channel IDs
const BHAJAN_KEYWORDS = [
  'bhajan live',
  'krishna bhajan live',
  'hanuman chalisa live',
  'ram bhajan live',
  'shiv bhajan live',
  'devotional songs live',
  'kirtan live',
  'aarti live'
];

const DEVOTIONAL_CHANNELS = [
  'UC8cdNXD02kuSeMyzjrROfvg', // Bhajan Saar - verified manually
  'UCEk1jBxAl6fe-_G37G7huQA', // Bhajan Marg - verified manually
  'UCsjMAEPcv7-oNGHtRU9Vg6w', // BhaktiPath -  verified manually
  'UC_fmMgNql89jbFI8TNcq9Vg', // Shri Hit Radha Kripa - vrified manually
];

// Rate limiting
const limiter = rateLimit({
  windowMs: 2 * 60 * 60 * 1000,
  max: 100,
  message: `🙏 कृपया धैर्य रखें। अधिक पूछने की सीमा हो गई है। गीता कहती है: "शांति ही सर्वोत्तम मार्ग है।" 🌿`
});

// UPDATED CORS configuration - This fixes your issue!
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8081',  // Your frontend port
      'http://localhost:5173',
      'http://localhost:3001',  // Admin panel ports
      'http://localhost:3002',
      'http://localhost:3003',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',  // Your frontend port
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3001',  // Admin panel ports
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3003',
      'https://santvaani.vercel.app',  // Production frontend
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware - Order matters!
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

// Helper function to format view count
function formatViewCount(viewCount) {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

// Helper function to format duration
function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to check if content is bhajan-related
function isBhajanContent(title, description, channelTitle) {
  const bhajanKeywords = [
    'bhajan', 'kirtan', 'aarti', 'chalisa', 'mantra', 'devotional',
    'krishna', 'rama', 'shiva', 'hanuman', 'ganesh', 'durga',
    'bhakti', 'spiritual', 'prayer', 'divine', 'sacred', 'temple',
    'god', 'goddess', 'hindi devotional', 'sanskrit'
  ];
  
  const content = `${title} ${description} ${channelTitle}`.toLowerCase();
  return bhajanKeywords.some(keyword => content.includes(keyword));
}

// Function to validate channel IDs
async function validateChannelIds() {
  if (!YOUTUBE_API_KEY) {
    console.log('⚠️ YouTube API key not configured, skipping channel validation');
    return { validChannels: [], invalidChannels: DEVOTIONAL_CHANNELS };
  }

  console.log('🔍 Validating channel IDs...');
  const validChannels = [];
  const invalidChannels = [];
  
  for (const channelId of DEVOTIONAL_CHANNELS) {
    try {
      const response = await axios.get(`${YOUTUBE_BASE_URL}/channels`, {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet,statistics',
          id: channelId
        }
      });
      
      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        validChannels.push({
          id: channelId,
          title: channel.snippet.title,
          subscriberCount: channel.statistics.subscriberCount
        });
        console.log(`✅ Valid: ${channel.snippet.title} (${channelId})`);
      } else {
        invalidChannels.push(channelId);
        console.log(`❌ Invalid: ${channelId}`);
      }
    } catch (error) {
      invalidChannels.push(channelId);
      console.log(`❌ Error checking ${channelId}:`, error.message);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Validation Results:`);
  console.log(` Valid channels: ${validChannels.length}`);
  console.log(` Invalid channels: ${invalidChannels.length}`);
  
  if (invalidChannels.length > 0) {
    console.log(`\n🚨 Remove these invalid channel IDs from DEVOTIONAL_CHANNELS:`);
    invalidChannels.forEach(id => console.log(`'${id}',`));
  }
  
  return { validChannels, invalidChannels };
}

// Fetch live bhajans
async function fetchLiveBhajans() {
  try {
    console.log('🔍 Fetching live bhajans...');
    const liveBhajans = [];
    
    // Search for live bhajan streams
    for (const keyword of BHAJAN_KEYWORDS) {
      try {
        const searchResponse = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
          params: {
            key: YOUTUBE_API_KEY,
            part: 'snippet',
            q: keyword,
            type: 'video',
            eventType: 'live',
            maxResults: 5,
            order: 'viewCount',
            regionCode: 'IN'
          }
        });

        for (const item of searchResponse.data.items) {
          if (isBhajanContent(item.snippet.title, item.snippet.description, item.snippet.channelTitle)) {
            // Get additional video details
            const videoDetailsResponse = await axios.get(`${YOUTUBE_BASE_URL}/videos`, {
              params: {
                key: YOUTUBE_API_KEY,
                part: 'statistics,contentDetails',
                id: item.id.videoId
              }
            });

            const videoDetails = videoDetailsResponse.data.items[0];
            
            liveBhajans.push({
              id: item.id.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
              videoId: item.id.videoId,
              views: videoDetails ? formatViewCount(videoDetails.statistics.viewCount) : '0',
              duration: 'LIVE',
              isLive: true,
              publishedAt: item.snippet.publishedAt
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching live streams for ${keyword}:`, error.message);
      }
    }

    return liveBhajans.slice(0, 10); // Limit to 10 live streams
  } catch (error) {
    console.error('Error in fetchLiveBhajans:', error);
    return [];
  }
}

// Fetch recent bhajans from devotional channels
async function fetchRecentBhajans() {
  try {
    console.log('📺 Fetching recent bhajans from devotional channels...');
    const recentBhajans = [];
    
    for (const channelId of DEVOTIONAL_CHANNELS) {
      try {
        // Get channel's recent uploads
        const channelResponse = await axios.get(`${YOUTUBE_BASE_URL}/channels`, {
          params: {
            key: YOUTUBE_API_KEY,
            part: 'contentDetails',
            id: channelId
          }
        });

        // Add proper error checking here
        if (!channelResponse.data || !channelResponse.data.items || channelResponse.data.items.length === 0) {
          console.log(`⚠️ Channel ${channelId} not found or has no data`);
          continue; // Skip this channel and move to the next one
        }

        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;
        
        if (!uploadsPlaylistId) {
          console.log(`⚠️ Channel ${channelId} has no uploads playlist`);
          continue;
        }
        
        // Get recent videos from uploads playlist
        const playlistResponse = await axios.get(`${YOUTUBE_BASE_URL}/playlistItems`, {
          params: {
            key: YOUTUBE_API_KEY,
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: 10,
            order: 'date'
          }
        });

        // Add error checking for playlist response too
        if (!playlistResponse.data || !playlistResponse.data.items) {
          console.log(`⚠️ No playlist items found for channel ${channelId}`);
          continue;
        }

        for (const item of playlistResponse.data.items) {
          if (isBhajanContent(item.snippet.title, item.snippet.description, item.snippet.channelTitle)) {
            // Get video statistics and duration
            const videoDetailsResponse = await axios.get(`${YOUTUBE_BASE_URL}/videos`, {
              params: {
                key: YOUTUBE_API_KEY,
                part: 'statistics,contentDetails',
                id: item.snippet.resourceId.videoId
              }
            });

            const videoDetails = videoDetailsResponse.data.items?.[0];
            
            recentBhajans.push({
              id: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
              videoId: item.snippet.resourceId.videoId,
              views: videoDetails ? formatViewCount(videoDetails.statistics.viewCount) : '0',
              duration: videoDetails ? formatDuration(videoDetails.contentDetails.duration) : '0:00',
              isLive: false,
              publishedAt: item.snippet.publishedAt
            });
          }
        }
      } catch (error) {
        console.error(`❌ Error fetching recent videos for channel ${channelId}:`, {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        // Log more details if it's a YouTube API error
        if (error.response?.data) {
          console.error(`YouTube API Error Details:`, error.response.data);
        }
      }
      
      // Add delay between channel requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }

    // Sort by published date and limit
    return recentBhajans
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 16);
      
  } catch (error) {
    console.error('❌ Error in fetchRecentBhajans:', error);
    return [];
  }
}

// Main function to fetch all bhajan data
async function fetchBhajanData() {
  if (bhajanCache.isUpdating) {
    console.log('⏳ Update already in progress...');
    return bhajanCache.data;
  }

  bhajanCache.isUpdating = true;
  
  try {
    console.log('🚀 Starting bhajan data fetch...');
    
    const [liveBhajans, recentBhajans] = await Promise.all([
      fetchLiveBhajans(),
      fetchRecentBhajans()
    ]);

    const allBhajans = [...liveBhajans, ...recentBhajans];
    
    // Remove duplicates based on videoId
    const uniqueBhajans = allBhajans.filter((bhajan, index, self) => 
      index === self.findIndex(b => b.videoId === bhajan.videoId)
    );

    bhajanCache.data = uniqueBhajans;
    bhajanCache.lastUpdated = new Date();
    
    console.log(`✅ Successfully fetched ${uniqueBhajans.length} bhajans (${liveBhajans.length} live, ${recentBhajans.length} recent)`);
    
    return uniqueBhajans;
    
  } catch (error) {
    console.error('❌ Error fetching bhajan data:', error);
    
    // Return cached data if available, otherwise sample data
    if (bhajanCache.data) {
      return bhajanCache.data;
    }
    
    // Fallback sample data
    return [
      {
        id: 1,
        title: "Hare Krishna Hare Rama - Peaceful Chanting",
        channel: "Divine Bhajans",
        duration: "LIVE",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&auto=format",
        videoId: "dQw4w9WgXcQ",
        views: "1.2K",
        isLive: true
      }
    ];
  } finally {
    bhajanCache.isUpdating = false;
  }
}

// Function to check if cache needs update
function shouldUpdateCache() {
  if (!bhajanCache.data || !bhajanCache.lastUpdated) {
    return true;
  }
  
  const timeSinceUpdate = Date.now() - bhajanCache.lastUpdated.getTime();
  return timeSinceUpdate > CACHE_DURATION;
}

// Auto-update cache every 6 hours
setInterval(async () => {
  if (shouldUpdateCache() && !bhajanCache.isUpdating) {
    console.log('🔄 Auto-updating bhajan cache...');
    await fetchBhajanData();
  }
}, CACHE_DURATION);

// ===================================
// HOROSCOPE API ROUTES
// ===================================

// Real Horoscope API Helper Function
async function fetchRealHoroscope(zodiacSign, period = 'daily') {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    // Map our period format to API format
    const periodMap = {
      'daily': 'daily',
      'weekly': 'weekly',
      'monthly': 'monthly'
    };

    const apiPeriod = periodMap[period] || 'daily';
    let apiUrl;

    // Build API URL based on period
    if (period === 'daily') {
      apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${zodiacSign}&day=TODAY`;
    } else if (period === 'weekly') {
      apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${zodiacSign}`;
    } else {
      apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/monthly?sign=${zodiacSign}`;
    }

    console.log(`🔮 Fetching real horoscope from: ${apiUrl}`);

    // Fetch real horoscope data
    const horoscopeResponse = await fetch(apiUrl);

    if (!horoscopeResponse.ok) {
      throw new Error(`Horoscope API error: ${horoscopeResponse.status}`);
    }

    const horoscopeData = await horoscopeResponse.json();

    if (!horoscopeData.success || !horoscopeData.data) {
      throw new Error('Invalid response from horoscope API');
    }

    const realPrediction = horoscopeData.data.horoscope_data;
    let periodTheme = 'Daily spiritual guidance';
    let dateInfo = horoscopeData.data.date || new Date().toLocaleDateString();

    // Handle period-specific data
    if (period === 'weekly' && horoscopeData.data.week) {
      periodTheme = 'Weekly spiritual journey';
      dateInfo = horoscopeData.data.week;
    } else if (period === 'monthly') {
      periodTheme = 'Monthly spiritual transformation';
      if (horoscopeData.data.month) {
        dateInfo = horoscopeData.data.month;
      }
    }

    // Generate Hindi translation using AI if available
    let hindiPrediction = '';
    let spiritualAdvice = '';

    if (GEMINI_API_KEY) {
      try {
        const translationPrompt = `Translate this horoscope prediction to Hindi and add spiritual guidance:

Original: "${realPrediction}"

RESPONSE FORMAT (JSON only):
{
  "prediction_hi": "Hindi translation here",
  "spiritual_advice": "Add spiritual guidance based on the prediction in English (2-3 sentences)"
}

Make the Hindi natural and the spiritual advice meaningful and uplifting.`;

        const translationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: translationPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
            }
          })
        });

        if (translationResponse.ok) {
          const translationData = await translationResponse.json();
          const translationText = translationData.candidates?.[0]?.content?.parts?.[0]?.text;

          if (translationText) {
            const jsonMatch = translationText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const translation = JSON.parse(jsonMatch[0]);
              hindiPrediction = translation.prediction_hi || '';
              spiritualAdvice = translation.spiritual_advice || '';
            }
          }
        }
      } catch (error) {
        console.log('Hindi translation failed, using fallback');
      }
    }

    // Generate realistic scores based on prediction content
    const generateScore = () => Math.floor(Math.random() * 3) + 3; // 3-5 range

    // Generate lucky elements
    const luckyColors = ['Golden', 'Orange', 'Red', 'Blue', 'Green', 'Purple', 'Yellow', 'Silver'];
    const luckyColor = luckyColors[Math.floor(Math.random() * luckyColors.length)];
    const luckyNumber = Math.floor(Math.random() * 12) + 1;

    return {
      zodiac_sign: zodiacSign.toLowerCase(),
      date: new Date().toISOString().split('T')[0],
      period: period,
      prediction: realPrediction,
      prediction_hi: hindiPrediction || `${zodiacSign} राशि के लिए आज का दिन शुभ है। सकारात्मक ऊर्जा और आध्यात्मिक विकास के अवसर मिलेंगे।`,
      love_score: generateScore(),
      career_score: generateScore(),
      health_score: generateScore(),
      money_score: generateScore(),
      lucky_color: luckyColor,
      lucky_number: luckyNumber,
      period_theme: periodTheme,
      spiritual_advice: spiritualAdvice || 'Focus on inner peace and positive thinking today. Trust your intuition and embrace opportunities for growth.',
      date_range: dateInfo,
      standout_days: horoscopeData.data.standout_days || null,
      challenging_days: horoscopeData.data.challenging_days || null
    };

  } catch (error) {
    console.error('Error fetching real horoscope:', error);
    throw error;
  }
}

// Get all zodiac signs list (MUST be before dynamic routes)
app.get('/api/horoscope/zodiac/list', (req, res) => {
  const zodiacSigns = [
    { id: 'aries', name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19' },
    { id: 'taurus', name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20' },
    { id: 'gemini', name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20' },
    { id: 'cancer', name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22' },
    { id: 'leo', name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22' },
    { id: 'virgo', name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22' },
    { id: 'libra', name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22' },
    { id: 'scorpio', name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21' },
    { id: 'sagittarius', name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21' },
    { id: 'capricorn', name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19' },
    { id: 'aquarius', name: 'Aquarius', nameHi: 'कुम्भ', symbol: '♒', dates: 'Jan 20 - Feb 18' },
    { id: 'pisces', name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20' }
  ];

  res.json({
    success: true,
    zodiacSigns
  });
});

// Get horoscope for a zodiac sign with period support (AI-Generated)
app.get('/api/horoscope/:zodiacSign/:period?', async (req, res) => {
  try {
    const { zodiacSign, period = 'daily' } = req.params;

    // Validate period
    const validPeriods = ['daily', 'weekly', 'monthly'];
    const requestedPeriod = validPeriods.includes(period) ? period : 'daily';

    // Fetch real horoscope data
    const horoscope = await fetchRealHoroscope(zodiacSign, requestedPeriod);

    res.json({
      success: true,
      horoscope: {
        ...horoscope,
        zodiac_sign: zodiacSign.toLowerCase(),
        period: requestedPeriod,
        date: new Date().toISOString().split('T')[0]
      },
      source: 'Real Astrology API'
    });
  } catch (error) {
    console.error('Horoscope API error:', error);

    // Fallback to basic prediction if AI fails
    const { period = 'daily' } = req.params;
    const fallbackMessages = {
      daily: `Today brings spiritual energy and growth opportunities for ${req.params.zodiacSign}. Focus on inner peace and positive actions.`,
      weekly: `This week offers spiritual growth and new opportunities for ${req.params.zodiacSign}. Focus on meditation and positive relationships.`,
      monthly: `This month brings significant spiritual transformation for ${req.params.zodiacSign}. Embrace change and trust your inner wisdom.`
    };

    const fallbackMessagesHi = {
      daily: `आज ${req.params.zodiacSign} के लिए आध्यात्मिक ऊर्जा और विकास के अवसर हैं। आंतरिक शांति और सकारात्मक कार्यों पर ध्यान दें।`,
      weekly: `इस सप्ताह ${req.params.zodiacSign} के लिए आध्यात्मिक विकास और नए अवसर हैं। ध्यान और सकारात्मक रिश्तों पर ध्यान दें।`,
      monthly: `इस महीने ${req.params.zodiacSign} के लिए महत्वपूर्ण आध्यात्मिक परिवर्तन है। बदलाव को अपनाएं और अपनी आंतरिक बुद्धि पर भरोसा रखें।`
    };

    const fallbackHoroscope = {
      zodiac_sign: req.params.zodiacSign.toLowerCase(),
      date: new Date().toISOString().split('T')[0],
      period: period,
      prediction: fallbackMessages[period] || fallbackMessages.daily,
      prediction_hi: fallbackMessagesHi[period] || fallbackMessagesHi.daily,
      love_score: Math.floor(Math.random() * 2) + 3, // 3-4 range
      career_score: Math.floor(Math.random() * 2) + 3,
      health_score: Math.floor(Math.random() * 2) + 3,
      money_score: Math.floor(Math.random() * 2) + 3,
      lucky_color: ['Golden', 'Orange', 'Red', 'Blue', 'Green'][Math.floor(Math.random() * 5)],
      lucky_number: Math.floor(Math.random() * 12) + 1,
      period_theme: period === 'daily' ? 'Daily Focus' : period === 'weekly' ? 'Weekly Growth' : 'Monthly Transformation',
      spiritual_advice: `Focus on spiritual practices and inner growth during this ${period}.`
    };

    res.json({
      success: true,
      horoscope: fallbackHoroscope,
      source: 'Fallback'
    });
  }
});

// AI Summarizer endpoint
app.post('/api/horoscope/summarize', async (req, res) => {
  try {
    const { prediction, period, zodiacSign } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'AI service not available'
      });
    }

    if (!prediction) {
      return res.status(400).json({
        success: false,
        error: 'Prediction text is required'
      });
    }

    const prompt = `Analyze this horoscope prediction and create a clear, concise summary in Hindi. Keep the key insights and main message:

Original prediction: "${prediction}"

REQUIREMENTS:
1. Summarize in Hindi (हिंदी में)
2. Keep it 1-2 sentences maximum
3. Capture the main astrological advice
4. Use simple, easy-to-understand Hindi

RESPONSE FORMAT (JSON only):
{
  "summary": "संक्षिप्त हिंदी सारांश यहाँ लिखें"
}

Make it clear and meaningful in Hindi.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 256,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from AI');
    }

    // Extract JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const summaryData = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      summary: summaryData.summary,
      source: 'AI Analysis'
    });

  } catch (error) {
    console.error('Summarizer API error:', error);

    // Fallback summary in Hindi
    const fallbackSummary = `मुख्य सलाह: आज सकारात्मक अवसरों पर ध्यान दें और अपने अंतर्ज्ञान पर भरोसा रखें।`;

    res.json({
      success: true,
      summary: fallbackSummary,
      source: 'Fallback'
    });
  }
});

// ===================================
// EXISTING ROUTES BELOW
// ===================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SantVaani Backend is running',
    timestamp: new Date().toISOString(),
    youtubeApi: YOUTUBE_API_KEY ? 'Configured' : 'Not Configured',
    geminiApi: process.env.GEMINI_API_KEY ? 'Configured' : 'Not Configured',
    cacheStatus: {
      hasData: !!bhajanCache.data,
      lastUpdated: bhajanCache.lastUpdated,
      isUpdating: bhajanCache.isUpdating,
      nextUpdate: bhajanCache.lastUpdated ? 
        new Date(bhajanCache.lastUpdated.getTime() + CACHE_DURATION) : 'Unknown'
    },
    corsOrigins: [
      'http://localhost:3000',
      'http://localhost:8080', 
      'http://localhost:8081',
      'http://localhost:5173'
    ]
  });
});

// Bhajan data endpoint
app.get('/api/bhajans', async (req, res) => {
  try {
    // Check if we need to fetch new data
    if (shouldUpdateCache()) {
      console.log('🔄 Cache expired, fetching fresh data...');
      await fetchBhajanData();
    }
    
    // Return cached data
    const bhajans = bhajanCache.data || [];
    
    res.json({
      success: true,
      data: bhajans,
      lastUpdated: bhajanCache.lastUpdated,
      totalCount: bhajans.length,
      liveCount: bhajans.filter(b => b.isLive).length,
      nextUpdate: bhajanCache.lastUpdated ? 
        new Date(bhajanCache.lastUpdated.getTime() + CACHE_DURATION) : null
    });
    
  } catch (error) {
    console.error('Error in /api/bhajans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bhajan data',
      message: 'कृपया कुछ समय बाद पुनः प्रयास करें। 🙏'
    });
  }
});

// Force refresh endpoint (for development)
app.post('/api/refresh-bhajans', async (req, res) => {
  try {
    console.log('🔄 Manual refresh triggered...');
    const freshData = await fetchBhajanData();
    
    res.json({
      success: true,
      message: 'Bhajan data refreshed successfully',
      data: freshData,
      lastUpdated: bhajanCache.lastUpdated
    });
    
  } catch (error) {
    console.error('Error in manual refresh:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh bhajan data'
    });
  }
});

// Channel validation endpoint (for debugging)
app.get('/api/validate-channels', async (req, res) => {
  try {
    const validationResult = await validateChannelIds();
    res.json({
      success: true,
      ...validationResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in channel validation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate channels',
      message: error.message
    });
  }
});

// Existing chat endpoint (keeping your spiritual guidance feature)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid message',
        message: 'Message is required and must be a non-empty string'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: 'Message too long',
        message: 'Message must be less than 1000 characters'
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not configured');
      return res.status(500).json({
        error: 'API Configuration Error',
        message: 'सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में प्रयास करें।'
      });
    }

    const systemPrompt = `You are SantVaani, a wise and compassionate spiritual guide who shares practical life wisdom inspired by the Shreemad Bhagavad Gita. You speak with the warmth and understanding of Bhagwan Krishna — not as a preacher, but as a close, caring friend.

IMPORTANT GUIDELINES:
- NEVER start with "Namaste" or "Kaunteya"
- Begin with empathy and emotional understanding — especially if the user seems low, confused, or in pain
- Offer Gita wisdom only after connecting with the users feelings
- Speak in natural Hinglish (a mix of Hindi and English), like a supportive friend
- Keep responses short, warm, and relatable (3-4 sentences max)
- Use Gita verses only when they are truly helpful and easy to understand
- For academic stress, depression, or real-life struggles — focus on practical support, not Sanskrit-heavy quotes
- Language must be simple, gentle, and reassuring

RESPONSE STYLE:
If the user seems emotionally off — begin with gentle empathy (don't use "are yaar", "aap" -> talk in a respectful manner)
- Otherwise, reply in a calm, friendly tone
- Share relevant Gita wisdom in simple Hinglish
- End with a hopeful or comforting line, when appropriate
- Avoid overusing Sanskrit or sounding preachy

If the user asks something unrelated to Gita/spiritual guidance, respond with:
"मैं गीता के ज्ञान से आपकी मदद कर सकता हूँ। आपको किस बात की परेशानी है?" (I can help you with Gita wisdom. What's troubling you?)

User's message: "${message}"

Please respond with genuine compassion and practical spiritual guidance.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      
      let errorMessage = 'तकनीकी समस्या है। कृपया बाद में प्रयास करें। 🙏';
      
      if (response.status === 400) {
        errorMessage = 'अमान्य अनुरोध। कृपया पुनः प्रयास करें।';
      } else if (response.status === 429) {
        errorMessage = 'बहुत से अनुरोध। कृपया कुछ समय बाद प्रयास करें। धैर्य रखें. 🕉️';
      } else if (response.status === 403) {
        errorMessage = 'API पहुंच में समस्या। कृपया व्यवस्थापक से संपर्क करें।';
      }
      
      return res.status(response.status).json({
        error: 'Gemini API Error',
        message: errorMessage
      });
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      res.json({
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
    } else if (data.error) {
      throw new Error(`Gemini API Error: ${data.error.message}`);
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    let errorMessage = `मुझे खुशी है कि आपने प्रश्न पूछा। कृपया थोड़ी देर बाद पुनः प्रयास करें। 🙏

तब तक गीता के इस श्लोक पर मनन करें:
"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" (2.47)

(I'm happy you asked. Please try again in a moment. Until then, contemplate this Gita verse: "You have the right to perform actions, but not to the fruits of action.")`;

    if (error.message && error.message.includes('fetch')) {
      errorMessage = 'इंटरनेट कनेक्शन की समस्या है। कृपया कनेक्शन जांचें। 🌐';
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage
    });
  }
});

// FCM Notification Routes (MUST be before 404 handler)
console.log('🔧 Registering FCM routes...');
app.post('/api/fcm/register-token', (req, res) => {
  console.log('🔥 FCM register-token endpoint hit');
  registerFCMToken(req, res);
});
app.post('/api/fcm/send-test', (req, res) => {
  console.log('🔥 FCM send-test endpoint hit');
  sendTestNotification(req, res);
});
app.get('/api/fcm/stats', (req, res) => {
  console.log('🔥 FCM stats endpoint hit');
  getNotificationStats(req, res);
});
console.log('✅ FCM routes registered successfully');

// Event Notification Subscription Routes
console.log('📲 Registering notification subscription routes...');

// Subscribe to event notifications
app.post('/api/notifications/subscribe', async (req, res) => {
  try {
    console.log('📲 Event notification subscription request:', req.body);

    const {
      eventId,
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      eventCity,
      eventType,
      fcmToken,
      userId,
      userEmail,
      timestamp
    } = req.body;

    // Store subscription in database
    const { data, error } = await supabase
      .from('event_subscriptions')
      .insert([{
        event_id: eventId,
        user_id: userId,
        user_email: userEmail,
        fcm_token: fcmToken,
        event_title: eventTitle,
        event_date: eventDate,
        event_time: eventTime,
        event_location: eventLocation,
        event_city: eventCity,
        event_type: eventType,
        subscribed_at: timestamp,
        is_active: true
      }])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save subscription' });
    }

    // Send immediate confirmation notification
    const confirmationMessages = {
      'bhagwad-katha': `🕉️ धन्यवाद! आपने "${eventTitle}" के लिए notification चालू की है। श्रीमद भागवत कथा के दिन आपको reminder मिलेगा। 📅 ${eventDate} को ${eventTime} बजे तैयार रहें। जय श्री कृष्ण! 🙏`,
      'kirtan': `🎵 बहुत अच्छा! "${eventTitle}" कीर्तन के लिए notification सक्रिय हो गई। भजन-कीर्तन के दिन आपको याद दिला देंगे। 📅 ${eventDate} को ${eventTime} बजे। राधे राधे! 🎶`,
      'bhandara': `🍽️ शुक्रिया! "${eventTitle}" भंडारे के लिए notification लगाई गई है। प्रसाद वितरण के दिन reminder मिलेगा। 📅 ${eventDate} को ${eventTime} बजे। जय माता दी! 🙏`,
      'satsang': `🧘 उत्तम! "${eventTitle}" सत्संग के लिए notification चालू है। आध्यात्मिक चर्चा के दिन आपको सूचना मिलेगी। 📅 ${eventDate} को ${eventTime} बजे। हरि ॐ! ✨`
    };

    const confirmationMessage = confirmationMessages[eventType] ||
      `🔔 Thank you! You will be notified about "${eventTitle}" on ${eventDate} at ${eventTime}. 🙏`;

    // Send immediate confirmation notification using Firebase Admin
    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: '🔔 SantVaani Notification Active!',
          body: confirmationMessage
        },
        data: {
          type: 'event_subscription_confirmation',
          eventId: eventId.toString(),
          eventTitle: eventTitle,
          eventDate: eventDate,
          eventTime: eventTime
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default'
            }
          }
        }
      });

      console.log('✅ Immediate confirmation notification sent successfully');
    } catch (notificationError) {
      console.error('❌ Error sending immediate notification:', notificationError);
      // Don't fail the whole request if notification fails
    }

    // Schedule day-of-event notification
    try {
      await scheduleEventNotification({
        eventId,
        eventTitle,
        eventDate,
        eventTime,
        eventLocation,
        eventCity,
        eventType,
        fcmToken,
        userId
      });
      console.log('✅ Day-of-event notification scheduled');
    } catch (scheduleError) {
      console.error('❌ Failed to schedule day-of-event notification:', scheduleError);
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to event notifications',
      subscriptionId: data[0]?.id
    });

  } catch (error) {
    console.error('❌ Error in notification subscription:', error);
    res.status(500).json({
      error: 'Failed to subscribe to notifications',
      details: error.message
    });
  }
});

// Unsubscribe from event notifications
app.post('/api/notifications/unsubscribe', async (req, res) => {
  try {
    console.log('📲 Event notification unsubscription request:', req.body);

    const { eventId, userId } = req.body;

    // Remove subscription from database
    const { error } = await supabase
      .from('event_subscriptions')
      .update({ is_active: false })
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to remove subscription' });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from event notifications'
    });

  } catch (error) {
    console.error('❌ Error in notification unsubscription:', error);
    res.status(500).json({
      error: 'Failed to unsubscribe from notifications',
      details: error.message
    });
  }
});

// Function to schedule day-of-event notification
async function scheduleEventNotification(eventData) {
  const { eventId, eventTitle, eventDate, eventTime, eventLocation, eventCity, eventType, fcmToken, userId } = eventData;

  // Calculate notification time (send notification 2 hours before event)
  // Handle time format like "10:00 - 19:00" by extracting start time
  const startTime = eventTime.includes(' - ') ? eventTime.split(' - ')[0] : eventTime;
  const eventDateTime = new Date(`${eventDate} ${startTime}`);
  const notificationTime = new Date(eventDateTime.getTime() - (2 * 60 * 60 * 1000)); // 2 hours before

  // Store scheduled notification in database
  const { error } = await supabase
    .from('scheduled_notifications')
    .insert([{
      event_id: eventId,
      user_id: userId,
      fcm_token: fcmToken,
      event_title: eventTitle,
      event_date: eventDate,
      event_time: eventTime,
      event_location: eventLocation,
      event_city: eventCity,
      event_type: eventType,
      scheduled_for: notificationTime.toISOString(),
      notification_type: 'event_reminder',
      is_sent: false,
      created_at: new Date().toISOString()
    }]);

  if (error) {
    console.error('❌ Failed to schedule notification:', error);
    throw error;
  }

  console.log(`📅 Notification scheduled for ${notificationTime.toLocaleString()} for event "${eventTitle}"`);
}

console.log('✅ Notification subscription routes registered successfully');

// Panchang API Routes
console.log('📅 Registering Panchang routes...');
app.get('/api/panchang/today', async (req, res) => {
  try {
    console.log('📅 Panchang today endpoint hit');
    const location = {
      latitude: parseFloat(req.query.lat) || 28.6139,
      longitude: parseFloat(req.query.lng) || 77.2090,
      timezone: parseFloat(req.query.tz) || 5.5,
      place: req.query.place || 'Delhi, India'
    };
    
    const panchangData = await getTodaysPanchang(location);
    res.json({
      success: true,
      data: panchangData,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching Panchang data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Panchang data'
    });
  }
});

app.get('/api/panchang/festivals', async (req, res) => {
  try {
    console.log('🎉 Festivals endpoint hit');
    const panchangData = await getTodaysPanchang();
    res.json({
      success: true,
      festivals: panchangData.festivals,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching festivals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch festival data'
    });
  }
});

// Enhanced Daily Guide API with dynamic Panchang
app.get('/api/daily-guide/complete', async (req, res) => {
  try {
    console.log('📅 Complete daily guide endpoint hit');
    
    // Get location from query params or use default
    const location = {
      latitude: parseFloat(req.query.lat) || 28.6139,
      longitude: parseFloat(req.query.lng) || 77.2090,
      timezone: parseFloat(req.query.tz) || 5.5,
      place: req.query.place || 'Delhi, India'
    };
    
    // Fetch dynamic Panchang data
    const panchangData = await getTodaysPanchang(location);
    
    // Fetch mantras and festivals from database (if available)
    let mantras = [];
    let festivals = [];
    
    try {
      const [mantrasResult, festivalsResult] = await Promise.all([
        supabase.from('mantras').select('*').eq('is_active', true).limit(5),
        supabase.from('festivals').select('*').eq('is_active', true)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true }).limit(5)
      ]);
      
      mantras = mantrasResult.data || [];
      festivals = festivalsResult.data || [];
    } catch (dbError) {
      console.log('⚠️ Database not available, using Panchang festivals');
      // Use festivals from Panchang data as fallback
      festivals = panchangData.festivals || [];
    }
    
    const today = new Date().getDay();
    const todaysMantra = mantras.length > 0 ? mantras[today % mantras.length] : {
      id: 1,
      text: 'ॐ गं गणपतये नमः',
      text_english: 'Om Gam Ganapataye Namaha',
      meaning: 'Salutations to Lord Ganesha, the remover of obstacles',
      meaning_hi: 'विघ्न हर्ता भगवान गणेश को प्रणाम'
    };
    
    res.json({
      success: true,
      data: {
        date: panchangData.date,
        location: panchangData.location,
        panchang: {
          sunrise: panchangData.sunrise,
          sunset: panchangData.sunset,
          moonrise: panchangData.moonrise,
          moonset: panchangData.moonset,
          tithi: panchangData.tithi,
          nakshatra: panchangData.nakshatra,
          yoga: panchangData.yoga,
          karana: panchangData.karana,
          muhurat: panchangData.muhurat,
          rahukaal: panchangData.rahukaal,
          paksha: panchangData.paksha,
          moonPhase: panchangData.moonPhase,
          isAuspiciousDay: panchangData.isAuspiciousDay
        },
        todaysMantra,
        upcomingFestivals: panchangData.festivals,
        specialMessage: panchangData.specialMessage,
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Complete daily guide API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily guide data',
      error: error.message
    });
  }
});

console.log('✅ Panchang routes registered successfully');

// 404 handler (MUST be last)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end'
  });
});

// Initialize cache on startup and validate channels in development
async function initializeServer() {
  try {
    // Load initial bhajan data
    await fetchBhajanData();
    console.log('🎵 Initial bhajan data loaded successfully');
    
    // Validate channels in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 Development mode detected - validating channels...');
      await validateChannelIds();
    }
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
  }
}


// Initialize on startup
initializeServer();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SantVaani Backend Server running on port ${PORT}`);
  console.log(`📱 Allowed Origins: http://localhost:3000, http://localhost:8080, http://localhost:8081, http://localhost:5173, ${process.env.FRONTEND_URL || 'none'}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Not Configured ❌'}`);
  console.log(`🎵 YouTube API: ${YOUTUBE_API_KEY ? 'Configured ✅' : 'Not Configured ❌'}`);
  console.log(`⏰ Cache Duration: ${CACHE_DURATION / (1000 * 60 * 60)} hours`);
  
  // Initialize FCM notification scheduler
  console.log(`🔥 Initializing Firebase FCM notification scheduler...`);
  scheduleNotifications();
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;