# 🕉️ SantVaani Backend API

A spiritual content aggregation service that provides bhajan data, AI-powered Gita wisdom, and YouTube integration.

## 🚀 Features

- **YouTube API Integration**: Live bhajan fetching and caching
- **Gemini AI Chatbot**: Bhagavad Gita wisdom powered by Google's Gemini AI
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin resource sharing
- **Caching System**: Efficient data caching for better performance

## 📋 API Endpoints

### Health Check
```
GET /api/health
```

### Bhajan Data
```
GET /api/bhajans
POST /api/refresh-bhajans
```

### AI Chat
```
POST /api/chat
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm
- YouTube API Key
- Gemini API Key

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
FRONTEND_URL=http://localhost:8080
PORT=5000
NODE_ENV=development
CACHE_DURATION_HOURS=6
```

### Development
```bash
npm run dev    # Uses nodemon for auto-restart
```

### Production
```bash
npm start
```

## 🚀 Deployment

### Railway (Recommended)
1. Connect your GitHub repository
2. Select the `/backend` directory
3. Add environment variables
4. Deploy automatically

### Render
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

### Vercel (Serverless)
- Requires restructuring to serverless functions
- Not recommended for this architecture

## 🧪 Testing
```bash
npm test
```

## 📊 Performance
- **Rate Limit**: 100 requests per 2 hours
- **Cache Duration**: 6 hours (configurable)
- **Response Time**: < 200ms (average)

## 🔒 Security Features
- CORS protection
- Rate limiting
- Input validation
- Environment variable protection

## 📈 Monitoring
- Health check endpoint: `/api/health`
- Error logging with spiritual messages
- API usage tracking
