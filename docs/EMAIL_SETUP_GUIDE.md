# Santvaani Email Setup Guide
**Simple, Affordable Email System with Brevo**

---

## 💰 Cost Breakdown

### Brevo Free Tier
- **300 emails/day** = 9,000/month
- Perfect for getting started!

### When You Grow
- **0-300 users:** FREE
- **300-5,000 users:** $25/month (20K emails)
- **5,000+ users:** $65/month (100K emails)

**This is VERY affordable!** Even at 5,000 users, it's only $65/month to send meaningful emails.

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Create Brevo Account (5 mins)

1. Go to: https://www.brevo.com/
2. Click "Sign up free"
3. Fill in your details
4. Verify your email

### Step 2: Get API Key (3 mins)

1. Login to Brevo dashboard
2. Go to "Settings" (top right)
3. Click "SMTP & API" in left sidebar
4. Click "Generate a new API key"
5. Name it: "Santvaani Backend"
6. Copy the API key

### Step 3: Configure Sender (5 mins)

1. In Brevo, go to "Senders"
2. Click "Add a sender"
3. Add:
   - **Name:** Santvaani
   - **Email:** hello@santvaani.com (or your domain)
4. Verify the email (check inbox and click verify link)

**Note:** If you don't have a custom domain yet, you can use:
- Gmail: youremail@gmail.com
- But custom domain looks more professional

### Step 4: Add API Key to Backend (2 mins)

Add to `backend/.env`:
```env
BREVO_API_KEY=your_api_key_here
```

### Step 5: Install Package (1 min)

```bash
cd backend
npm install @sendinblue/client
```

### Step 6: Test It! (5 mins)

Create `backend/test_email.js`:
```javascript
const { sendWelcomeEmail } = require('./email_service');

// Test with your email
sendWelcomeEmail('your-email@gmail.com', 'Test User')
  .then(result => console.log('Success!', result))
  .catch(error => console.error('Error:', error));
```

Run:
```bash
node test_email.js
```

Check your inbox - you should receive a beautiful welcome email! 🎉

---

## 📧 4 Email Types Implemented

### 1. Welcome Email
**Trigger:** When user signs up
**Template:** Beautiful gradient header, feature list, CTA button

### 2. 7-Day Milestone
**Trigger:** 7 days after signup
**Template:** Celebration theme, journey stats, community invitation

### 3. 30-Day Milestone
**Trigger:** 30 days after signup
**Template:** Achievement theme, transformation message, special gift

### 4. Admin Broadcast
**Trigger:** Admin clicks "Send Email" in dashboard
**Template:** Customizable subject, content, and CTA

---

## 🔧 Integration with Backend

### When User Signs Up

In `server.js`, after Firebase user creation:

```javascript
const { sendWelcomeEmail } = require('./email_service');

// After user signup success
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name } = req.body;

    // ... your existing signup code ...

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name)
      .then(result => console.log('Welcome email sent:', result))
      .catch(error => console.error('Email error:', error));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Milestone Emails (Automated)

We'll use a cron job to check and send milestone emails.

Create `backend/email_scheduler.js`:
```javascript
const cron = require('node-cron');
const { supabase } = require('./server');
const { send7DayEmail, send30DayEmail } = require('./email_service');

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Checking for milestone emails...');

  try {
    const today = new Date();

    // Get users who signed up 7 days ago
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: sevenDayUsers } = await supabase
      .from('users')
      .select('email, name')
      .gte('created_at', sevenDaysAgo.toISOString().split('T')[0])
      .lt('created_at', new Date(sevenDaysAgo.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    // Send 7-day emails
    for (const user of sevenDayUsers || []) {
      await send7DayEmail(user.email, user.name);
      console.log(`✅ Sent 7-day email to ${user.email}`);
    }

    // Get users who signed up 30 days ago
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: thirtyDayUsers } = await supabase
      .from('users')
      .select('email, name')
      .gte('created_at', thirtyDaysAgo.toISOString().split('T')[0])
      .lt('created_at', new Date(thirtyDaysAgo.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    // Send 30-day emails
    for (const user of thirtyDayUsers || []) {
      await send30DayEmail(user.email, user.name);
      console.log(`✅ Sent 30-day email to ${user.email}`);
    }

    console.log('✅ Milestone email check complete!');
  } catch (error) {
    console.error('❌ Error in milestone email scheduler:', error);
  }
});

console.log('📧 Email scheduler started - checking daily at 9 AM');
```

Then in `server.js`:
```javascript
// At the top
require('./email_scheduler'); // Start email scheduler
```

Install node-cron:
```bash
npm install node-cron
```

---

## 🎨 Admin Broadcast Feature

### Backend API Endpoint

Add to `server.js`:
```javascript
const { sendBroadcastEmail } = require('./email_service');

// Admin send broadcast email
app.post('/api/admin/send-broadcast-email', async (req, res) => {
  try {
    const { subject, htmlContent, recipientFilter } = req.body;

    // Get recipients based on filter
    let query = supabase.from('users').select('email, name');

    if (recipientFilter === 'active') {
      // Users active in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte('last_active', thirtyDaysAgo.toISOString());
    }

    const { data: users, error } = await query;

    if (error) throw error;

    // Send broadcast
    const result = await sendBroadcastEmail(users, subject, htmlContent);

    res.json({
      success: true,
      emailsSent: users.length,
      result
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Admin Frontend Page

Create `admin/src/pages/EmailBroadcast.tsx`:
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function EmailBroadcast() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in subject and message",
        variant: "destructive"
      });
      return;
    }

    setSending(true);

    try {
      // Create HTML template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%); padding: 40px; text-align: center; }
            .content { padding: 40px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white;">🕉️ Santvaani</h1>
            </div>
            <div class="content">
              <p>Namaste {{name}},</p>
              ${message}
              <p>With blessings,<br>Santvaani Team 🙏</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const response = await fetch('/api/admin/send-broadcast-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          htmlContent,
          recipientFilter: 'all'
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Email sent to ${data.emailsSent} users`
        });
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Send Broadcast Email</h1>

      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block font-medium mb-2">Subject Line</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Happy Diwali from Santvaani!"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={10}
          />
          <p className="text-sm text-gray-500 mt-1">
            You can use basic HTML. {{name}} will be replaced with user's name.
          </p>
        </div>

        <Button
          onClick={handleSend}
          disabled={sending}
          className="w-full"
        >
          {sending ? 'Sending...' : 'Send to All Users'}
        </Button>
      </div>
    </div>
  );
}
```

Add to admin routing in `admin/src/App.tsx`:
```tsx
import EmailBroadcast from './pages/EmailBroadcast';

// In your routes
<Route path="/email-broadcast" element={<EmailBroadcast />} />
```

---

## 📊 Email Analytics

Brevo provides built-in analytics:
- Open rate
- Click rate
- Bounce rate
- Unsubscribe rate

View in Brevo Dashboard > Campaigns > Transactional

---

## ✅ Checklist

- [ ] Create Brevo account
- [ ] Get API key
- [ ] Add sender email
- [ ] Add BREVO_API_KEY to .env
- [ ] Install @sendinblue/client
- [ ] Test welcome email
- [ ] Set up email scheduler
- [ ] Create admin broadcast page
- [ ] Test milestone emails
- [ ] Monitor analytics

---

## 🎯 What Makes This Special

### 1. **Super Affordable**
- Free for first 300 emails/day
- Scales affordably as you grow

### 2. **Beautiful Design**
- Professional gradient design
- Mobile responsive
- Brand colors (orange & purple)

### 3. **Personal Touch**
- Uses user's name
- Celebrates their journey
- Feels like a friend, not a brand

### 4. **No Complexity**
- One simple file (`email_service.js`)
- Easy to understand and maintain
- No fancy frameworks needed

---

## 🚀 Next Steps

1. **This Week:** Set up Brevo and test welcome email
2. **Next Week:** Implement milestone scheduler
3. **Week 3:** Create admin broadcast feature
4. **Week 4:** Monitor analytics and optimize

---

## 💡 Future Ideas (When You're Ready)

- Birthday emails (if users share birthday)
- Festival-specific emails (Diwali, Holi, etc.)
- Weekly digest with top bhajans
- Re-engagement for inactive users
- Personalized content recommendations

---

You're going to make your users feel SO special! 🙏✨
