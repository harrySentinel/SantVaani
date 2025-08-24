const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
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

// AI-Generated Horoscope Helper Function
async function generateHoroscope(zodiacSign) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const prompt = `Generate a daily horoscope for ${zodiacSign} for ${today}. 

REQUIREMENTS:
1. Write a spiritual and positive prediction (2-3 sentences)
2. Include both English and Hindi versions
3. Provide realistic scores (1-5) for Love, Career, Health, Money
4. Suggest a lucky color and lucky number (1-12)
5. Make it inspiring and spiritual, focusing on growth and positivity

RESPONSE FORMAT (JSON only):
{
  "prediction": "English prediction here",
  "prediction_hi": "Hindi prediction here",
  "love_score": 4,
  "career_score": 3,
  "health_score": 5,
  "money_score": 3,
  "lucky_color": "Golden",
  "lucky_number": 7
}

Generate fresh, unique content. Focus on spiritual growth, positivity, and practical life guidance.`;

  try {
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
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const horoscopeData = JSON.parse(jsonMatch[0]);
    
    return {
      zodiac_sign: zodiacSign.toLowerCase(),
      date: new Date().toISOString().split('T')[0],
      period: 'daily',
      ...horoscopeData
    };
  } catch (error) {
    console.error('Error generating horoscope:', error);
    throw error;
  }
}

// Get daily horoscope for a zodiac sign (AI-Generated)
app.get('/api/horoscope/:zodiacSign', async (req, res) => {
  try {
    const { zodiacSign } = req.params;
    
    // Generate AI horoscope
    const horoscope = await generateHoroscope(zodiacSign);
    
    res.json({
      success: true,
      horoscope,
      source: 'AI-Generated'
    });
  } catch (error) {
    console.error('Horoscope API error:', error);
    
    // Fallback to basic prediction if AI fails
    const fallbackHoroscope = {
      zodiac_sign: zodiacSign.toLowerCase(),
      date: new Date().toISOString().split('T')[0],
      period: 'daily',
      prediction: `Today brings spiritual energy and growth opportunities for ${zodiacSign}. Focus on inner peace and positive actions.`,
      prediction_hi: `आज ${zodiacSign} के लिए आध्यात्मिक ऊर्जा और विकास के अवसर हैं। आंतरिक शांति और सकारात्मक कार्यों पर ध्यान दें।`,
      love_score: Math.floor(Math.random() * 2) + 3, // 3-4 range
      career_score: Math.floor(Math.random() * 2) + 3,
      health_score: Math.floor(Math.random() * 2) + 3,
      money_score: Math.floor(Math.random() * 2) + 3,
      lucky_color: ['Golden', 'Orange', 'Red', 'Blue', 'Green'][Math.floor(Math.random() * 5)],
      lucky_number: Math.floor(Math.random() * 12) + 1
    };

    res.json({
      success: true,
      horoscope: fallbackHoroscope,
      source: 'Fallback'
    });
  }
});

// Get all zodiac signs list
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

// 404 handler
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
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;