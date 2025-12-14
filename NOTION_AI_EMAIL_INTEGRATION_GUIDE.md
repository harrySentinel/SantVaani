# 🚀 Santvaani AI & Email Integration Guide

> **Complete guide for adding AI agents and email services to make Santvaani enterprise-level**

---

## 📋 Table of Contents

- [AI Agent Integration](#ai-agent-integration)
- [Email Service Integration](#email-service-integration)
- [Where to Use Them in Santvaani](#where-to-use-them)
- [Implementation Roadmap](#implementation-roadmap)

---

# 🤖 AI Agent Integration

## Best Free AI Agents for Santvaani

### 1. ⭐ Google Gemini API (RECOMMENDED)

**Why Choose This:**
- ✅ Completely FREE (60 requests/min, 1500/day)
- ✅ Best for spiritual content
- ✅ Supports Hindi & English
- ✅ Easy to integrate
- ✅ No credit card required

**Free Tier Details:**
| Feature | Free Tier |
|---------|-----------|
| Requests/Minute | 60 |
| Requests/Day | 1,500 |
| Cost | $0 Forever |
| Context Window | 32K tokens |
| Languages | 100+ including Hindi |

**Setup Steps:**

```bash
# 1. Get API Key
# Go to: https://makersuite.google.com/app/apikey
# Click "Get API Key" → Create API key

# 2. Install SDK
npm install @google/generative-ai

# 3. Create .env file
GEMINI_API_KEY=your_api_key_here
```

**Implementation Code:**

```javascript
// backend/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Spiritual Q&A Chatbot
export async function getSpiritualAnswer(question) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a spiritual guide for Santvaani, a platform dedicated to Indian saints and spiritual wisdom.
Answer this question with compassion and wisdom: ${question}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Generate Daily Quote
export async function generateDailyQuote() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate an inspiring spiritual quote in both English and Hindi
  from the teachings of Indian saints like Kabir, Meera, Tulsidas, or Ramakrishna.
  Format:
  English: [quote]
  Hindi: [quote in Devanagari]`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Content Moderation
export async function moderateComment(comment) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze if this comment is appropriate for a spiritual platform.
  Comment: "${comment}"

  Respond with JSON:
  {
    "appropriate": true/false,
    "reason": "brief explanation"
  }`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

---

### 2. Anthropic Claude API (Haiku)

**Why Choose This:**
- ✅ $5 free credits for new users
- ✅ Best at understanding context
- ✅ Ethical AI - perfect for spiritual content
- ✅ Very cheap after free tier ($0.25/million tokens)

**Setup:**
```bash
# Get API key from: https://console.anthropic.com/
npm install @anthropic-ai/sdk
```

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getChatResponse(userMessage) {
  const message = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: userMessage
      }
    ],
  });

  return message.content[0].text;
}
```

---

### 3. Hugging Face (100% FREE Forever)

**Why Choose This:**
- ✅ Completely free, unlimited
- ✅ 1000+ pre-trained models
- ✅ Can run custom spiritual models
- ✅ Open source

**Setup:**
```bash
# Get token from: https://huggingface.co/settings/tokens
npm install @huggingface/inference
```

```javascript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function generateText(prompt) {
  const result = await hf.textGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    inputs: prompt,
    parameters: {
      max_new_tokens: 200,
      temperature: 0.7,
    }
  });

  return result.generated_text;
}
```

---

## 🎯 Where to Use AI in Santvaani

### 1. **Spiritual Chatbot** 💬
**Location:** `/chatbot` page or floating widget

**What it does:**
- Answer questions about saints, bhajans, scriptures
- Provide spiritual guidance
- Explain Hindu philosophy concepts

**Implementation:**
```javascript
// frontend/src/pages/chatbot/index.tsx
// Add a chat interface that calls your AI backend

// backend/server.js
app.post('/api/chatbot/ask', async (req, res) => {
  const { question } = req.body;
  const answer = await getSpiritualAnswer(question);
  res.json({ answer });
});
```

---

### 2. **Auto-Generate Daily Quotes** 📜
**Location:** Homepage, Dashboard

**What it does:**
- Generate fresh spiritual quotes daily
- Automatically post to Santvaani Space
- Email subscribers

**Implementation:**
```javascript
// backend/cron/dailyQuote.js
import cron from 'node-cron';

// Run every day at 6 AM
cron.schedule('0 6 * * *', async () => {
  const quote = await generateDailyQuote();

  // Save to database
  await supabase.from('spiritual_posts').insert({
    title: 'Daily Spiritual Quote',
    content: quote,
    is_published: true
  });

  // Send email to subscribers
  await sendDailyQuoteEmail(quote);
});
```

---

### 3. **Comment Moderation** 🛡️
**Location:** Santvaani Space, Blog comments

**What it does:**
- Auto-filter inappropriate comments
- Flag spam
- Maintain spiritual atmosphere

**Implementation:**
```javascript
// backend/server.js
app.post('/api/santvaani-space/posts/:id/comments', async (req, res) => {
  const { comment } = req.body;

  // Moderate before saving
  const moderation = await moderateComment(comment);

  if (!moderation.appropriate) {
    return res.status(400).json({
      error: 'Comment not appropriate for spiritual platform',
      reason: moderation.reason
    });
  }

  // Save comment if appropriate
  await saveComment(comment);
  res.json({ success: true });
});
```

---

### 4. **Personalized Recommendations** 🎯
**Location:** User Dashboard

**What it does:**
- Recommend bhajans based on listening history
- Suggest saints to follow
- Personalized spiritual content

**Implementation:**
```javascript
export async function getPersonalizedRecommendations(userId) {
  const userHistory = await getUserActivity(userId);

  const prompt = `Based on this user's spiritual interests:
  - Favorite saints: ${userHistory.favoriteSaints}
  - Listened bhajans: ${userHistory.bhajans}

  Recommend 5 bhajans and 3 saints they might like.`;

  const recommendations = await getSpiritualAnswer(prompt);
  return recommendations;
}
```

---

### 5. **Auto-Translation** 🌐
**Location:** All content

**What it does:**
- Translate English → Hindi automatically
- Translate Hindi → English
- Support bilingual users

**Implementation:**
```javascript
export async function translateContent(text, targetLang) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Translate this spiritual content to ${targetLang}:
  ${text}

  Maintain spiritual tone and respect.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

# 📧 Email Service Integration

## Best Free Email Service: Resend ⭐

**Why Resend is BEST:**
- ✅ 3,000 emails/month FREE
- ✅ 100 emails/day limit
- ✅ Modern, developer-friendly API
- ✅ Excellent deliverability
- ✅ Beautiful email templates
- ✅ No credit card required for free tier

**Comparison Table:**

| Service | Free Emails/Month | Daily Limit | Best For |
|---------|-------------------|-------------|----------|
| **Resend** ⭐ | 3,000 | 100 | Best overall |
| Brevo | 9,000 | 300 | High volume |
| SendGrid | 3,000 | 100 | Reliability |
| Mailgun | 5,000 (3 months) | - | API features |
| Amazon SES | 62,000* | - | Scale |

*from EC2 only

---

## Resend Setup & Implementation

### Step 1: Get API Key

```bash
# 1. Go to: https://resend.com/
# 2. Sign up (FREE, no credit card)
# 3. Go to API Keys
# 4. Create new API key
# 5. Add to .env
```

### Step 2: Install & Configure

```bash
npm install resend

# .env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@santvaani.com
```

### Step 3: Create Email Service

```javascript
// backend/services/emailService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Welcome Email
export async function sendWelcomeEmail(userEmail, userName) {
  await resend.emails.send({
    from: 'Santvaani <noreply@santvaani.com>',
    to: userEmail,
    subject: '🙏 Welcome to Santvaani - Your Spiritual Journey Begins',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316;">Welcome, ${userName}! 🕉️</h1>
        <p>We're delighted to have you join the Santvaani community.</p>
        <p>Explore:</p>
        <ul>
          <li>📿 Sacred Bhajans</li>
          <li>🙏 Saints' Wisdom</li>
          <li>✨ Santvaani Space</li>
          <li>📖 Spiritual Blog</li>
        </ul>
        <a href="https://santvaani.com" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
          Start Your Journey
        </a>
        <p style="color: #666; margin-top: 30px;">
          May your spiritual journey be blessed 🙏
        </p>
      </div>
    `
  });
}

// Daily Spiritual Quote Email
export async function sendDailyQuoteEmail(subscribers, quote) {
  for (const subscriber of subscribers) {
    await resend.emails.send({
      from: 'Santvaani Daily <quotes@santvaani.com>',
      to: subscriber.email,
      subject: '🌅 Your Daily Spiritual Quote',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f97316; text-align: center;">Daily Wisdom 🕉️</h2>
          <blockquote style="font-size: 18px; font-style: italic; color: #333; border-left: 4px solid #f97316; padding-left: 20px; margin: 30px 0;">
            ${quote}
          </blockquote>
          <p style="text-align: center; color: #666;">
            <a href="https://santvaani.com/santvaani-space">Read More on Santvaani Space →</a>
          </p>
        </div>
      `
    });
  }
}

// Comment Notification
export async function sendCommentNotification(postAuthor, commenterName, commentText, postTitle) {
  await resend.emails.send({
    from: 'Santvaani <notifications@santvaani.com>',
    to: postAuthor.email,
    subject: `💬 ${commenterName} commented on your post`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Comment on "${postTitle}"</h2>
        <p><strong>${commenterName}</strong> commented:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          ${commentText}
        </div>
        <a href="https://santvaani.com/santvaani-space/${postAuthor.postId}">View Comment →</a>
      </div>
    `
  });
}

// Like Notification
export async function sendLikeNotification(postAuthor, likerName, postTitle) {
  await resend.emails.send({
    from: 'Santvaani <notifications@santvaani.com>',
    to: postAuthor.email,
    subject: `❤️ ${likerName} liked your post`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your post got a like! ❤️</h2>
        <p><strong>${likerName}</strong> liked your post:</p>
        <p style="font-size: 18px; color: #333;">"${postTitle}"</p>
        <a href="https://santvaani.com/santvaani-space">Visit Santvaani Space →</a>
      </div>
    `
  });
}

// Event Reminder
export async function sendEventReminder(subscribers, event) {
  for (const subscriber of subscribers) {
    await resend.emails.send({
      from: 'Santvaani Events <events@santvaani.com>',
      to: subscriber.email,
      subject: `🎉 Upcoming Event: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f97316;">📅 Event Reminder</h1>
          <h2>${event.title}</h2>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p>${event.description}</p>
          <a href="https://santvaani.com/events/${event.id}" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
            View Event Details
          </a>
        </div>
      `
    });
  }
}

// Password Reset
export async function sendPasswordResetEmail(userEmail, resetToken) {
  await resend.emails.send({
    from: 'Santvaani Security <security@santvaani.com>',
    to: userEmail,
    subject: '🔒 Reset Your Santvaani Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="https://santvaani.com/reset-password?token=${resetToken}" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `
  });
}

// Weekly Digest
export async function sendWeeklyDigest(subscriber, weeklyContent) {
  await resend.emails.send({
    from: 'Santvaani Weekly <digest@santvaani.com>',
    to: subscriber.email,
    subject: '📬 Your Weekly Spiritual Digest',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316;">This Week on Santvaani 🕉️</h1>

        <h3>🔥 Trending Bhajans</h3>
        <ul>
          ${weeklyContent.bhajans.map(b => `<li>${b.title}</li>`).join('')}
        </ul>

        <h3>📝 New Blog Posts</h3>
        <ul>
          ${weeklyContent.blogs.map(b => `<li><a href="${b.url}">${b.title}</a></li>`).join('')}
        </ul>

        <h3>💬 Santvaani Space Highlights</h3>
        <ul>
          ${weeklyContent.posts.map(p => `<li>${p.title} - ${p.likes} likes</li>`).join('')}
        </ul>

        <a href="https://santvaani.com" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
          Visit Santvaani
        </a>
      </div>
    `
  });
}
```

---

## 🎯 Where to Use Email in Santvaani

### 1. **User Authentication Flow**
- [ ] Welcome email on signup
- [ ] Email verification
- [ ] Password reset
- [ ] Login from new device alert

### 2. **Engagement Notifications**
- [ ] Someone liked your post
- [ ] Someone commented on your post
- [ ] Your comment got a reply
- [ ] New follower (if you add this feature)

### 3. **Content Updates**
- [ ] Daily spiritual quote (6 AM)
- [ ] Weekly digest (Sunday evening)
- [ ] New bhajan added notification
- [ ] New blog post notification

### 4. **Event Reminders**
- [ ] Event registration confirmation
- [ ] Event reminder (1 day before)
- [ ] Event reminder (1 hour before)
- [ ] Post-event thank you

### 5. **Re-engagement**
- [ ] "We miss you" email (inactive users)
- [ ] "New features" announcement
- [ ] Festival greetings (Diwali, Holi, etc.)

---

## 📝 Implementation Roadmap

### Phase 1: Email Setup (Week 1)
- [ ] Setup Resend account
- [ ] Configure domain & DNS
- [ ] Create email templates
- [ ] Test welcome email

### Phase 2: Core Emails (Week 2)
- [ ] Welcome email on signup
- [ ] Password reset email
- [ ] Email verification
- [ ] Test all flows

### Phase 3: Engagement Emails (Week 3)
- [ ] Like notifications
- [ ] Comment notifications
- [ ] Reply notifications
- [ ] Add email preferences page

### Phase 4: AI Integration (Week 4)
- [ ] Setup Gemini API
- [ ] Create spiritual chatbot
- [ ] Add to frontend
- [ ] Test responses

### Phase 5: Advanced Features (Week 5)
- [ ] Daily quote generation + email
- [ ] Comment moderation
- [ ] Personalized recommendations
- [ ] Auto-translation

### Phase 6: Automation (Week 6)
- [ ] Setup cron jobs
- [ ] Weekly digest email
- [ ] Event reminders
- [ ] Analytics & monitoring

---

## 💡 Pro Tips

### Email Best Practices
1. **Don't spam** - Max 1-2 emails per day
2. **Unsubscribe link** - Always include
3. **Personalize** - Use user's name
4. **Mobile-friendly** - Test on mobile
5. **Track opens** - Use Resend analytics

### AI Best Practices
1. **System prompts** - Define AI personality
2. **Rate limiting** - Prevent abuse
3. **Caching** - Cache common responses
4. **Fallback** - Have backup if API fails
5. **Monitor costs** - Track API usage

---

## 🚀 Quick Start Commands

```bash
# Backend setup
cd backend
npm install resend @google/generative-ai

# Add to .env
echo "GEMINI_API_KEY=your_key" >> .env
echo "RESEND_API_KEY=your_key" >> .env
echo "RESEND_FROM_EMAIL=noreply@santvaani.com" >> .env

# Test email
node -e "require('./services/emailService').sendWelcomeEmail('test@email.com', 'Test User')"

# Test AI
node -e "require('./services/aiService').getSpiritualAnswer('What is dharma?')"
```

---

## 📊 Cost Estimation

### Free Tier (Current)
| Service | Monthly Cost |
|---------|--------------|
| Gemini API | $0 |
| Resend Email | $0 |
| **Total** | **$0** |

### When You Scale (1000 active users)
| Service | Monthly Cost |
|---------|--------------|
| Gemini API | $0 (still free) |
| Resend Email | $0 (3K emails enough) |
| **Total** | **$0** |

### At 10,000 active users
| Service | Monthly Cost |
|---------|--------------|
| Gemini API | ~$5-10 |
| Resend Email | ~$10-20 |
| **Total** | **~$15-30/month** |

---

## 📞 Support Resources

- **Gemini Docs:** https://ai.google.dev/docs
- **Resend Docs:** https://resend.com/docs
- **Gemini Community:** https://developers.googleblog.com/
- **Resend Discord:** https://resend.com/discord

---

## ✅ Checklist Before Going Live

- [ ] API keys stored in .env (not committed to git)
- [ ] Email domain verified in Resend
- [ ] Test all email templates
- [ ] Test AI responses for accuracy
- [ ] Add rate limiting to prevent abuse
- [ ] Setup error monitoring
- [ ] Create unsubscribe page
- [ ] Add email preferences to user settings
- [ ] Test on staging environment
- [ ] Monitor API usage/costs

---

**Created for Santvaani - Digital Spiritual Platform**
**Last Updated:** December 2024

🙏 _May this guide help make Santvaani an enterprise-level platform_
