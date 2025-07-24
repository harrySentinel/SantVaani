# 🕉️ SantVaani – A Bhakti Platform for the Modern Age

Welcome to **SantVaani** – a spiritual storytelling platform built to share the timeless wisdom of Indian saints and devotional teachings with the world.  
From soul-touching bhajans to divine quotes and saintly life stories — SantVaani bridges technology and bhakti in a peaceful, modern design.

---

## ✨ What is SantVaani?

SantVaani is a full-stack web app designed to spread spiritual knowledge and inspire devotion through:

- 🧘‍♂️ **Life stories** of saints like Meera Bai, Kabir, Tulsidas, and more  
- 🎶 **Bhajans** in Hindi & Hinglish (with lyrics and shareable modals)  
- 💬 **Quotes** with authorship (e.g., Kabir, Tulsidas) and calm UI animations  
- 📺 **YouTube Live Bhajans** and curated spiritual video playlists — now watch your favorite satsangs and bhajans live, directly from the platform  
- 🛕 **Old Age Homes & Orphanages** listing with donation support  
- 💝 A dedicated **Donation Page** to directly support listed Ashrams and Orphanages  
- 🌅 Aesthetic and modern UI with a peaceful **saffron/orange theme**

---

## 🔧 Tech Stack

Built with a modern, scalable, and spiritual tech stack:

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui  
- **UI Enhancements:** Radix UI, smooth page transitions  
- **Database:** Supabase (PostgreSQL with Prisma ORM)  
- **Authentication:** Supabase Auth  
- **Deployment:** Vercel, Railway
- **Media Integration:** YouTube Live Embed API

---

## 📌 Features (Implemented & Upcoming)

- ✅ Divine homepage with calm, spiritual animations  
- ✅ Saint Stories in Hindi & English  
- ✅ Bhajans & Quotes section with modals, copy/share/audio  
- ✅ Watch **Live Bhajans** & curated **YouTube Videos** from top devotional channels  
- ✅ Category-wise listing of **Old Age Homes** and **Orphanages**  
- ✅ **Donation Page** to support verified Ashrams and Orphanages  
- ✅ **Visitor Counter** beautifully animated via Supabase  
- 🔄 Contact flow for institutions to submit their listing (via santvaani@gmail.com)  
- 🔜 Bhagavad Gita Chatbot (GEMINI AI)  
- 🔜 Bookmark & Save your favorite bhajans/quotes  
- 🔜 Admin dashboard for content uploads and feedback management  

---

## 💝 Support Seva – Donate with Heart

SantVaani is not just a platform for devotion but also for **compassionate action** for spiritual seekers.  
We’ve built a dedicated **Donation Page** where users can explore, support, and directly contribute to:

- Verified **Vridh Ashrams** (Old Age Homes)  
- Trusted **Orphanages** in need of support  

Help us spread joy and dignity to those who need it most 🕊️

---

## 🎥 Watch Live Bhajans Anytime, Anywhere

Now, experience **live-streamed bhajans and satsangs** from top devotional YouTube channels — right within SantVaani.

- No distractions, just devotion
- Seamless YouTube Live embeds
- Peaceful design with full-screen support
- Channel list curated from trusted sources like T-Series Bhakti Sagar, Rajshri Soul, Bhajan Saar, and more

> 🌐 **Live Bhakti meets Digital Simplicity.**

---

## 🎯 Vision

To revive and preserve the spiritual richness of Bharat through a digital-first approach.  
SantVaani aims to be a **peaceful space on the internet** where anyone—young or old—can discover devotion, reflect, and feel inspired.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/harrySentinel/SantVaani.git
cd santvaani-digital-ashram
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
# Add your Supabase credentials to .env
```

### 3. Setup Backend
```bash
cd ../backend
npm install

# Create environment file
cp .env.example .env
# Add your API keys to .env
```

### 4. Run Development Servers

**Frontend** (Port 8080):
```bash
cd frontend
npm run dev
```

**Backend** (Port 5000):
```bash
cd backend
npm start
```

### 5. Run Tests
```bash
cd frontend
npm run test        # Interactive mode
npm run test:run    # Single run
```

### 6. Build for Production
```bash
cd frontend
npm run build
npm run preview     # Preview production build
```

---

## 🧪 Testing

We maintain comprehensive test coverage with:
- **Unit Tests**: Component testing with Vitest + Testing Library (Jest)
- **Integration Tests**: API and routing tests
- **Error Boundary Tests**: Production error handling

**Test Commands:**
```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # Visual test runner
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables in Vercel dashboard

### Backend (Railway/Heroku)
1. Deploy the `/backend` directory
2. Set start command: `npm start`
3. Add environment variables in hosting dashboard

### Environment Variables

**Frontend (.env):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=your_backend_url
```

**Backend (.env):**
```env
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
FRONTEND_URL=your_frontend_url
PORT=5000
```

---

## 📊 Project Stats

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Testing**: 14 Tests - 100% Pass Rate
- **Build Size**: ~720KB (optimized)
- **Performance**: A+ Lighthouse scores

---

## 👥 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the timeless wisdom of Indian saints
- Built with love for the spiritual community
- Special thanks to all open-source contributors

**Made with ♥️ for spreading divine wisdom**

---

*“सर्वे भवन्तु सुखिनः”* - May all beings be happy
