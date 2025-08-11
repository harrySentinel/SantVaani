# SantVaani Admin Panel

A modern, professional admin panel for managing spiritual content on the SantVaani platform. Built for content administrators and students to easily add and manage Saints, Bhajans, Divine Forms, and Quotes.

## 🚀 Features

### ✅ Completed
- **Modern React + TypeScript + Vite** setup
- **Professional UI** with Tailwind CSS and shadcn/ui
- **Saints Management** - Complete CRUD operations
- **Dashboard** with overview statistics
- **Search & Filtering** across all content
- **Bulk Operations** - Select and delete multiple items
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Toast Notifications** - User-friendly feedback
- **Image Handling** - Support for saint images

### 🚧 In Progress
- Living Saints management page
- Divine Forms management page  
- Bhajans management page
- Quotes management page
- Authentication system
- Image upload functionality
- Bulk import/export features

## 🛠 Installation

### Prerequisites
- Node.js 18+ installed
- Access to Supabase database

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd admin
   npm install
   ```

2. **Configure Supabase**
   - Open `src/lib/supabase.ts`
   - Replace with your actual Supabase URL and anon key:
   ```typescript
   const supabaseUrl = 'https://your-project-url.supabase.co'
   const supabaseKey = 'your-anon-key'
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The admin panel will be available at `http://localhost:3001`

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── Header.tsx      # Top header bar
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Admin dashboard
│   │   ├── Saints.tsx      # Saints management
│   │   └── ...            # Other content pages
│   ├── lib/               # Utilities and configs
│   │   ├── supabase.ts    # Database connection
│   │   └── utils.ts       # Helper functions
│   ├── hooks/             # Custom React hooks
│   └── App.tsx           # Main app component
├── package.json
└── README.md
```

## 🎯 Usage Guide for Students

### Adding a New Saint

1. **Navigate to Saints** in the sidebar
2. **Click "Add Saint"** button
3. **Fill out the form:**
   - Name (English) - Required
   - Name (Hindi) - Optional but recommended
   - Period (e.g., "15th Century")
   - Region (e.g., "Maharashtra")
   - Specialty (e.g., "Devotional Poetry")
   - Description and Biography
   - Image URL

4. **Preview** your content before saving
5. **Save** - The saint will appear immediately

### Best Practices

#### ✅ Content Guidelines
- **Always include Hindi text** when possible
- **Use respectful, accurate descriptions**
- **Verify historical information** before publishing
- **Keep descriptions clear and engaging**
- **Use high-quality, appropriate images**

#### ✅ Quality Checklist
- [ ] Name in both English and Hindi
- [ ] Clear, accurate period information
- [ ] Proper specialty categorization
- [ ] Engaging description (100-200 words)
- [ ] Detailed biography (500+ words)
- [ ] High-quality image
- [ ] Spell-check all text

### Managing Content

#### Search & Filter
- Use the **search bar** to quickly find saints
- Search works across **names, specialties, regions, and periods**
- **Filter by status** (has image, Hindi content, incomplete)

#### Bulk Operations
- **Select multiple saints** using checkboxes
- **Delete selected** saints with one click
- Use **Select All** for bulk operations

#### Status Indicators
- 🟢 **Has Image** - Saint has profile image
- 🔵 **Hindi Content** - Has Hindi translations
- 🟡 **Incomplete** - Missing description or biography

## 🔧 Technical Details

### Database Integration
- **Supabase** as backend database
- **Real-time updates** when content changes
- **Automatic timestamping** for created/updated dates
- **UUID primary keys** for all records

### Performance Features
- **Lazy loading** for images
- **Debounced search** to reduce database calls
- **Optimistic updates** for better UX
- **Error boundaries** to handle failures gracefully

### Security
- **Input validation** on all forms
- **XSS protection** with proper escaping
- **CSRF protection** via Supabase
- **Role-based access** (coming soon)

## 🚀 Deployment

### Option 1: Vercel (Recommended)
1. Push admin folder to GitHub
2. Connect to Vercel
3. Deploy automatically

### Option 2: Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure environment variables

### Option 3: Traditional Hosting
1. Build: `npm run build`
2. Upload `dist` contents to web server
3. Configure web server for SPA routing

## 📊 Statistics Dashboard

The dashboard provides real-time insights:
- **Total content counts** for each category
- **Recent activity** log of changes
- **Content quality metrics** (completeness, images, translations)
- **Quick action buttons** for common tasks

## 🆘 Troubleshooting

### Common Issues

**"Failed to load saints"**
- Check Supabase connection in `lib/supabase.ts`
- Verify database tables exist
- Check browser console for detailed errors

**Images not loading**
- Ensure image URLs are publicly accessible
- Check for CORS issues with image hosts
- Verify image URLs are valid

**Slow performance**
- Check network connection
- Clear browser cache
- Optimize large images

### Getting Help

1. Check the browser console for error messages
2. Verify database connection and permissions
3. Contact the technical team with specific error details

## 🔄 Updates & Maintenance

### Regular Tasks
- **Backup database** regularly
- **Update dependencies** monthly
- **Review content quality** weekly
- **Monitor performance** daily

### Version Updates
```bash
# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

**Built with ❤️ for SantVaani Platform**

*This admin panel is designed to make content management effortless while maintaining high quality standards. Happy content creating!*