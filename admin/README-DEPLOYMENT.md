# SantVaani Admin Panel - Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Quick Deploy
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Admin panel ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Select the `admin` folder as the root directory
   - Deploy!

### Manual Deploy via Vercel CLI
```bash
cd admin
npm install -g vercel
vercel
```

## 📝 Pre-Deployment Checklist

### ✅ Required Configuration
- [ ] Supabase URL and key configured in `src/lib/supabase.ts`
- [ ] Build command works: `npm run build`
- [ ] All dependencies installed: `npm install`

### ✅ Production Optimizations
- [ ] Environment variables set (if using .env)
- [ ] Database permissions configured in Supabase
- [ ] CORS settings updated if needed

## 🔧 Vercel Configuration

The project includes:
- ✅ `vercel.json` - Deployment configuration
- ✅ `.vercelignore` - Files to ignore during deployment
- ✅ SPA routing configured for React Router

## 🎯 Expected URLs
- **Admin Panel**: `https://your-project-name.vercel.app`
- **Custom Domain**: Setup available in Vercel dashboard

## 👥 For Your Students

### Access Information
- **URL**: [Your deployed URL]
- **Purpose**: Content Management System
- **Login**: No authentication required (trusted access)

### Quick Start Guide
1. Visit the admin panel URL
2. Navigate using the sidebar:
   - **Dashboard**: Overview of all content
   - **Saints**: Manage historical saints
   - **Living Saints**: Manage contemporary masters
   - **Divine Forms**: Manage sacred manifestations
   - **Bhajans**: Manage devotional songs
   - **Quotes**: Manage spiritual wisdom

### Best Practices for Students
- ✅ Always preview before saving
- ✅ Include both English and Hindi content when possible
- ✅ Use high-quality, appropriate images
- ✅ Verify information accuracy before publishing
- ✅ Use the search function to avoid duplicates

## 🛠 Technical Details

### Build Process
```bash
npm install    # Install dependencies
npm run build  # Create production build
```

### Local Development
```bash
npm run dev    # Start development server on port 3001
```

### Database Connection
- Uses Supabase for backend
- Real-time updates
- Automatic syncing with main website

## 🚨 Troubleshooting

### Common Issues
1. **Build fails**: Check `npm run build` locally
2. **Blank page**: Verify Supabase configuration
3. **Routing issues**: Ensure vercel.json is configured correctly

### Support
- Check browser console for errors
- Verify database connectivity
- Contact technical team with specific error messages

---

**🎉 Your admin panel is ready for production!**