const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting - prevent API abuse
const limiter = rateLimit({
  windowMs: 2 * 60 * 60 * 1000, // 2 hours
  max: 10, // limit each IP to 100 requests per windowMs
  message: `🙏 कृपया धैर्य रखें। अधिक पूछने की सीमा हो गई है।

गीता कहती है: "शांति ही सर्वोत्तम मार्ग है।" 🌿
`
});

// CORS configuration with multiple allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow multiple frontend URLs
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080', 
      'http://localhost:5173', // Vite default
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SantVaani Backend is running',
    timestamp: new Date().toISOString(),
    corsOrigin: req.headers.origin || 'No origin header'
  });
});

// Chat endpoint - handles Gemini API calls
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid message',
        message: 'Message is required and must be a non-empty string'
      });
    }

    // Check if message is too long
    if (message.length > 1000) {
      return res.status(400).json({
        error: 'Message too long',
        message: 'Message must be less than 1000 characters'
      });
    }

    // Check if Gemini API key is configured
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not configured');
      return res.status(500).json({
        error: 'API Configuration Error',
        message: 'सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में प्रयास करें।'
      });
    }

    // Enhanced system prompt for better spiritual guidance
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

    // Make API call to Gemini
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
    
    // Extract the response text
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
    
    // Provide helpful error messages
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

// FIXED: Use proper catch-all route syntax
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SantVaani Backend Server running on port ${PORT}`);
  console.log(`📱 Allowed Origins: http://localhost:3000, http://localhost:8080, ${process.env.FRONTEND_URL || 'none'}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Not Configured ❌'}`);
});

module.exports = app;