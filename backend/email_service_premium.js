// Santvaani Premium Email Service using Brevo
// Beautiful, branded email automation for spiritual transformation

const brevo = require('@getbrevo/brevo');
require('dotenv').config();

// Initialize Brevo client
let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Premium Email Templates - Branded & Feature-Complete
const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to Santvaani - Your Spiritual Journey Begins {{name}}',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Santvaani</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
            padding: 20px 0;
          }
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #9333ea 100%);
            padding: 50px 30px;
            text-align: center;
            position: relative;
          }
          .om-symbol {
            font-size: 72px;
            color: rgba(255, 255, 255, 0.95);
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 15px;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .brand-name {
            font-size: 42px;
            font-weight: 700;
            color: white;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 300;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 50px 40px;
          }
          .greeting {
            font-size: 28px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .intro-text {
            font-size: 17px;
            line-height: 1.8;
            color: #4b5563;
            margin-bottom: 30px;
          }
          .features-section {
            margin: 40px 0;
          }
          .section-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 25px;
            text-align: center;
          }
          .feature-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
          }
          .feature-item {
            display: table-row;
          }
          .feature-icon {
            display: table-cell;
            width: 50px;
            vertical-align: top;
            padding: 12px 0;
          }
          .feature-icon-inner {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
          .feature-content {
            display: table-cell;
            padding: 12px 0 12px 15px;
            vertical-align: top;
          }
          .feature-title {
            font-weight: 700;
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 4px;
          }
          .feature-desc {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
          }
          .highlight-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
            border-left: 4px solid #ea580c;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
          }
          .highlight-text {
            font-size: 16px;
            line-height: 1.7;
            color: #1f2937;
            font-style: italic;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            color: white;
            padding: 18px 50px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 17px;
            letter-spacing: 0.5px;
            box-shadow: 0 8px 20px rgba(234, 88, 12, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            box-shadow: 0 12px 28px rgba(234, 88, 12, 0.4);
            transform: translateY(-2px);
          }
          .quote-section {
            text-align: center;
            padding: 30px;
            background: #f9fafb;
            border-radius: 12px;
            margin: 30px 0;
          }
          .quote-text {
            font-size: 18px;
            font-style: italic;
            color: #374151;
            line-height: 1.7;
            margin-bottom: 10px;
          }
          .quote-author {
            font-size: 14px;
            color: #ea580c;
            font-weight: 600;
          }
          .footer {
            background: #1f2937;
            padding: 40px 30px;
            text-align: center;
          }
          .footer-om {
            font-size: 36px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 15px;
          }
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
          }
          .footer-text {
            color: #9ca3af;
            font-size: 14px;
            line-height: 1.6;
            margin: 10px 0;
          }
          .footer-link {
            color: #ea580c;
            text-decoration: none;
          }
          @media only screen and (max-width: 600px) {
            .content { padding: 30px 20px; }
            .greeting { font-size: 24px; }
            .brand-name { font-size: 36px; }
            .om-symbol { font-size: 60px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Premium Header -->
          <div class="header">
            <div class="om-symbol">ॐ</div>
            <div class="brand-name">Santvaani</div>
            <div class="tagline">Your Digital Spiritual Ashram</div>
          </div>

          <!-- Content Section -->
          <div class="content">
            <div class="greeting">Namaste {{name}},</div>

            <p class="intro-text">
              Welcome to Santvaani - where ancient wisdom meets modern technology.
              You've just joined thousands of seekers on a transformative spiritual journey.
              We're honored to be your companion on this sacred path.
            </p>

            <!-- Features Section -->
            <div class="features-section">
              <div class="section-title">Discover Your Spiritual Toolkit</div>

              <div class="feature-grid">
                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">📿</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Devotional Bhajans & Satsang</div>
                    <div class="feature-desc">Curated collection of divine bhajans and satsang content from YouTube's finest spiritual channels</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">🤖</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">AI Chatbot - Bhagavad Gita Wisdom</div>
                    <div class="feature-desc">Get instant answers to life's questions with references from the sacred Bhagavad Gita</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">📖</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Daily Spiritual Quotes</div>
                    <div class="feature-desc">Fresh wisdom delivered daily to inspire and guide your spiritual practice</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">💬</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Santvaani Space - Spiritual Social</div>
                    <div class="feature-desc">Connect with like-minded souls, share insights, and grow together</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">✨</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">AI-Powered Event Management</div>
                    <div class="feature-desc">Organize Bhagwat Katha, Paath, Bhandara with intelligent event planning</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">⭐</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Personalized Horoscope</div>
                    <div class="feature-desc">Vedic astrology insights tailored to your spiritual journey</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">🏛️</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Museum of Saints & Divine Forms</div>
                    <div class="feature-desc">Explore the lives of living saints and learn about various divine manifestations</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">📝</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Spiritual Blog & Teachings</div>
                    <div class="feature-desc">Deep-dive articles on spirituality, philosophy, and self-realization</div>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon">
                    <div class="feature-icon-inner">🙏</div>
                  </div>
                  <div class="feature-content">
                    <div class="feature-title">Sacred Donations (Daan)</div>
                    <div class="feature-desc">Support spiritual causes and earn divine blessings</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Highlight Box -->
            <div class="highlight-box">
              <div class="highlight-text">
                <strong>Special for You:</strong> Start your journey with our AI chatbot.
                Ask any question about life, dharma, or spirituality - get wisdom from the Bhagavad Gita instantly.
              </div>
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
              <a href="https://santvaani.vercel.app" class="cta-button">Begin Your Journey →</a>
            </div>

            <!-- Inspirational Quote -->
            <div class="quote-section">
              <div class="quote-text">
                "You are not a drop in the ocean. You are the entire ocean in a drop."
              </div>
              <div class="quote-author">— Rumi</div>
            </div>

            <p class="intro-text" style="margin-top: 30px; text-align: center;">
              <strong>With divine blessings,</strong><br>
              The Santvaani Team
            </p>
          </div>

          <!-- Premium Footer -->
          <div class="footer">
            <div class="footer-om">ॐ</div>
            <div class="footer-brand">Santvaani</div>
            <div class="footer-text">Your Digital Spiritual Ashram</div>
            <div class="footer-text">
              Spreading peace, wisdom & divine connection - one soul at a time
            </div>
            <div class="footer-text" style="margin-top: 20px;">
              <a href="https://santvaani.vercel.app" class="footer-link">Visit Santvaani</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  sevenDays: {
    subject: 'Your First Week of Spiritual Growth - {{name}}',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>7 Days of Spiritual Growth</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
            padding: 20px 0;
          }
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #ea580c 50%, #9333ea 100%);
            padding: 60px 30px;
            text-align: center;
          }
          .celebration {
            font-size: 80px;
            margin-bottom: 15px;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .header-title {
            font-size: 38px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }
          .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
          }
          .content {
            padding: 50px 40px;
          }
          .greeting {
            font-size: 28px;
            color: #1f2937;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
          }
          .intro-text {
            font-size: 17px;
            line-height: 1.8;
            color: #4b5563;
            text-align: center;
            margin-bottom: 40px;
          }
          .stats-box {
            background: linear-gradient(135deg, #fef3c7 0%, #e0f2fe 100%);
            padding: 40px;
            border-radius: 16px;
            margin: 30px 0;
            text-align: center;
          }
          .stats-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 30px;
          }
          .stat-number {
            font-size: 64px;
            font-weight: 700;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          .stat-label {
            font-size: 18px;
            color: #374151;
            font-weight: 600;
          }
          .milestone-message {
            font-size: 16px;
            color: #6b7280;
            margin-top: 20px;
            line-height: 1.7;
          }
          .journey-quote {
            background: #1f2937;
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin: 40px 0;
            text-align: center;
          }
          .quote-text {
            font-size: 20px;
            font-style: italic;
            line-height: 1.7;
            margin-bottom: 15px;
          }
          .quote-author {
            font-size: 14px;
            color: #ea580c;
            font-weight: 600;
          }
          .next-steps {
            margin: 40px 0;
          }
          .next-steps-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
          }
          .step-item {
            background: #f9fafb;
            padding: 20px;
            margin: 15px 0;
            border-radius: 12px;
            border-left: 4px solid #ea580c;
          }
          .step-title {
            font-weight: 700;
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .step-desc {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.6;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            color: white;
            padding: 18px 50px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 17px;
            box-shadow: 0 8px 20px rgba(234, 88, 12, 0.3);
          }
          .footer {
            background: #1f2937;
            padding: 40px 30px;
            text-align: center;
          }
          .footer-om {
            font-size: 36px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 15px;
          }
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
          }
          .footer-text {
            color: #9ca3af;
            font-size: 14px;
          }
          @media only screen and (max-width: 600px) {
            .content { padding: 30px 20px; }
            .stat-number { font-size: 48px; }
            .header-title { font-size: 32px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Celebration Header -->
          <div class="header">
            <div class="celebration">🎊</div>
            <div class="header-title">One Week Strong!</div>
            <div class="header-subtitle">Your Spiritual Journey Milestone</div>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">{{name}}, You're Incredible!</div>

            <p class="intro-text">
              Seven days ago, you took the first step on your spiritual journey with Santvaani.
              Today, we celebrate your commitment, dedication, and growth.
              <strong>This is just the beginning!</strong>
            </p>

            <!-- Stats Box -->
            <div class="stats-box">
              <div class="stats-title">Your Journey So Far</div>
              <div class="stat-number">7</div>
              <div class="stat-label">Days of Spiritual Connection</div>
              <div class="milestone-message">
                Every day you choose growth over stagnation, wisdom over ignorance,
                and peace over chaos. You're building something beautiful - a daily
                spiritual practice that will transform your life.
              </div>
            </div>

            <!-- Quote Section -->
            <div class="journey-quote">
              <div class="quote-text">
                "A journey of a thousand miles begins with a single step."
              </div>
              <div class="quote-author">— Lao Tzu</div>
              <div style="color: #d1d5db; margin-top: 15px; font-size: 15px;">
                You've taken 7 steps. Keep walking. The path reveals itself to those who persist.
              </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
              <div class="next-steps-title">Continue Your Growth</div>

              <div class="step-item">
                <div class="step-title">💬 Join Santvaani Space</div>
                <div class="step-desc">
                  Connect with our spiritual community. Share your insights, learn from others,
                  and grow together. You're not alone on this journey.
                </div>
              </div>

              <div class="step-item">
                <div class="step-title">🤖 Ask the Gita AI</div>
                <div class="step-desc">
                  Have a question about life, dharma, or your path? Our AI chatbot draws wisdom
                  from the Bhagavad Gita to guide you.
                </div>
              </div>

              <div class="step-item">
                <div class="step-title">✨ Create Your First Event</div>
                <div class="step-desc">
                  Planning a Bhagwat Katha or Paath? Use our AI-powered event management
                  to organize seamlessly.
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="cta-section">
              <a href="https://santvaani.vercel.app/santvaani-space" class="cta-button">
                Explore Santvaani Space →
              </a>
            </div>

            <p class="intro-text" style="margin-top: 40px;">
              <strong>Keep shining,</strong><br>
              The Santvaani Family
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-om">ॐ</div>
            <div class="footer-brand">Santvaani</div>
            <div class="footer-text">Celebrating your spiritual milestones</div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  thirtyDays: {
    subject: '🏆 30 Days of Transformation - {{name}}, You\'re Amazing!',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>30 Days Milestone</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #e0e7ff 100%);
            padding: 20px 0;
          }
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 25%, #dc2626 50%, #9333ea 75%, #7c3aed 100%);
            padding: 70px 30px;
            text-align: center;
            position: relative;
          }
          .trophy {
            font-size: 90px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .header-title {
            font-size: 42px;
            font-weight: 700;
            color: white;
            margin-bottom: 15px;
            letter-spacing: 1px;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .header-subtitle {
            color: rgba(255, 255, 255, 0.95);
            font-size: 20px;
            font-weight: 300;
          }
          .content {
            padding: 60px 40px;
          }
          .greeting {
            font-size: 32px;
            color: #1f2937;
            font-weight: 700;
            text-align: center;
            margin-bottom: 25px;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .intro-text {
            font-size: 18px;
            line-height: 1.9;
            color: #374151;
            text-align: center;
            margin-bottom: 50px;
          }
          .achievement-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #dbeafe 100%);
            padding: 50px;
            border-radius: 20px;
            margin: 40px 0;
            text-align: center;
            border: 3px solid #ea580c;
          }
          .achievement-badge {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #9333ea 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            box-shadow: 0 12px 30px rgba(234, 88, 12, 0.4);
          }
          .achievement-title {
            font-size: 26px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 25px;
          }
          .milestone-number {
            font-size: 72px;
            font-weight: 700;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 25px 0;
            line-height: 1;
          }
          .milestone-label {
            font-size: 22px;
            color: #ea580c;
            font-weight: 700;
            margin-bottom: 30px;
          }
          .achievement-list {
            text-align: left;
            max-width: 500px;
            margin: 30px auto 0;
          }
          .achievement-item {
            font-size: 16px;
            padding: 12px 0;
            color: #374151;
            border-bottom: 1px solid rgba(234, 88, 12, 0.2);
          }
          .achievement-item:last-child {
            border-bottom: none;
          }
          .sacred-verse {
            background: #1f2937;
            color: white;
            padding: 40px;
            border-radius: 16px;
            margin: 50px 0;
            text-align: center;
          }
          .verse-symbol {
            font-size: 48px;
            margin-bottom: 20px;
            opacity: 0.9;
          }
          .verse-text {
            font-size: 22px;
            font-style: italic;
            line-height: 1.8;
            margin-bottom: 20px;
          }
          .verse-translation {
            font-size: 15px;
            color: #d1d5db;
            line-height: 1.7;
            margin-bottom: 15px;
          }
          .verse-source {
            font-size: 14px;
            color: #ea580c;
            font-weight: 600;
            margin-top: 15px;
          }
          .gift-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
            padding: 40px;
            border-radius: 16px;
            margin: 40px 0;
            text-align: center;
            border: 2px dashed #ea580c;
          }
          .gift-title {
            font-size: 24px;
            font-weight: 700;
            color: #ea580c;
            margin-bottom: 15px;
          }
          .gift-text {
            font-size: 16px;
            color: #374151;
            line-height: 1.7;
            margin-bottom: 25px;
          }
          .cta-section {
            text-align: center;
            margin: 50px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            color: white;
            padding: 20px 60px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 12px 28px rgba(234, 88, 12, 0.4);
          }
          .share-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: #f9fafb;
            border-radius: 12px;
          }
          .share-text {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          .footer {
            background: #1f2937;
            padding: 50px 30px;
            text-align: center;
          }
          .footer-om {
            font-size: 42px;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 20px;
          }
          .footer-brand {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
          }
          .footer-text {
            color: #9ca3af;
            font-size: 15px;
            line-height: 1.7;
          }
          @media only screen and (max-width: 600px) {
            .content { padding: 40px 25px; }
            .greeting { font-size: 26px; }
            .milestone-number { font-size: 56px; }
            .header-title { font-size: 34px; }
            .achievement-box { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Epic Header -->
          <div class="header">
            <div class="trophy">🏆</div>
            <div class="header-title">Incredible Milestone!</div>
            <div class="header-subtitle">30 Days of Spiritual Transformation</div>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">{{name}}, You're AMAZING!</div>

            <p class="intro-text">
              For <strong>30 consecutive days</strong>, you've chosen spiritual growth over everything else.
              You've built a practice, developed discipline, and nurtured your inner light.
              <strong>This isn't just a milestone - this is transformation!</strong>
            </p>

            <!-- Achievement Box -->
            <div class="achievement-box">
              <div class="achievement-badge">⭐</div>
              <div class="achievement-title">Your Spiritual Evolution</div>
              <div class="milestone-number">30</div>
              <div class="milestone-label">Days of Divine Connection</div>

              <div class="achievement-list">
                <div class="achievement-item">📿 Countless bhajans that touched your soul</div>
                <div class="achievement-item">🤖 Wisdom from Bhagavad Gita AI guidance</div>
                <div class="achievement-item">💬 Connections in Santvaani Space community</div>
                <div class="achievement-item">📖 Daily quotes that transformed your thinking</div>
                <div class="achievement-item">🙏 Moments of deep peace and reflection</div>
              </div>
            </div>

            <!-- Sacred Verse -->
            <div class="sacred-verse">
              <div class="verse-symbol">ॐ</div>
              <div class="verse-text">
                "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।<br>
                न चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥"
              </div>
              <div class="verse-translation">
                The soul is neither born, and nor does it die. Weapons cannot cut it,
                fire cannot burn it, water cannot wet it, and wind cannot dry it.
                The soul is eternal, unchanging, and immovable.
              </div>
              <div class="verse-source">— Bhagavad Gita 2.23</div>
              <div style="color: #d1d5db; margin-top: 20px; font-size: 15px;">
                You're proving this eternal truth by nurturing your soul daily.
                Your commitment to spiritual growth is changing you from within.
              </div>
            </div>

            <!-- Gift Section -->
            <div class="gift-section">
              <div class="gift-title">🎁 A Special Gift for You</div>
              <div class="gift-text">
                As a token of our appreciation for your unwavering dedication, we've prepared
                something special just for you. Your 30-day journey deserves to be celebrated!
              </div>
              <div class="cta-section" style="margin: 20px 0;">
                <a href="https://santvaani.vercel.app" class="cta-button">
                  Claim Your Gift →
                </a>
              </div>
            </div>

            <!-- Share Section -->
            <div class="share-section">
              <div class="share-text">
                <strong>Inspire Others!</strong><br>
                Your journey can light the way for someone else. Share Santvaani with friends
                and family who seek peace, wisdom, and spiritual growth.
              </div>
              <div style="font-size: 14px; color: #ea580c; font-weight: 600;">
                Spread the light. One soul at a time. ✨
              </div>
            </div>

            <p class="intro-text" style="margin-top: 50px; font-size: 17px;">
              <strong>You've come so far. This is just the beginning.</strong><br><br>
              Proud of you,<br>
              <span style="font-size: 19px; font-weight: 700; color: #ea580c;">The Santvaani Family</span>
            </p>
          </div>

          <!-- Premium Footer -->
          <div class="footer">
            <div class="footer-om">ॐ</div>
            <div class="footer-brand">Santvaani</div>
            <div class="footer-text">
              Celebrating 30 days of your spiritual transformation<br>
              Your Digital Spiritual Ashram
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Send welcome email
async function sendWelcomeEmail(userEmail, userName) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Santvaani',
      email: 'santvaani.digitalashram@gmail.com'
    };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];
    sendSmtpEmail.subject = EMAIL_TEMPLATES.welcome.subject.replace('{{name}}', userName);
    sendSmtpEmail.htmlContent = EMAIL_TEMPLATES.welcome.htmlContent.replace(/{{name}}/g, userName);

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Send 7-day milestone email
async function send7DayEmail(userEmail, userName) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Santvaani',
      email: 'santvaani.digitalashram@gmail.com'
    };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];
    sendSmtpEmail.subject = EMAIL_TEMPLATES.sevenDays.subject.replace('{{name}}', userName);
    sendSmtpEmail.htmlContent = EMAIL_TEMPLATES.sevenDays.htmlContent.replace(/{{name}}/g, userName);

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ 7-day email sent:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending 7-day email:', error);
    return { success: false, error: error.message };
  }
}

// Send 30-day milestone email
async function send30DayEmail(userEmail, userName) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Santvaani',
      email: 'santvaani.digitalashram@gmail.com'
    };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];
    sendSmtpEmail.subject = EMAIL_TEMPLATES.thirtyDays.subject.replace('{{name}}', userName);
    sendSmtpEmail.htmlContent = EMAIL_TEMPLATES.thirtyDays.htmlContent.replace(/{{name}}/g, userName);

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ 30-day email sent:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending 30-day email:', error);
    return { success: false, error: error.message };
  }
}

// Send custom broadcast email (for admin)
async function sendBroadcastEmail(recipients, subject, htmlContent) {
  try {
    const results = [];

    for (const recipient of recipients) {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.sender = {
        name: 'Santvaani',
        email: 'santvaani.digitalashram@gmail.com'
      };
      sendSmtpEmail.to = [{
        email: recipient.email,
        name: recipient.name || 'Dear User'
      }];
      sendSmtpEmail.subject = subject.replace('{{name}}', recipient.name || 'Dear User');
      sendSmtpEmail.htmlContent = htmlContent.replace(/{{name}}/g, recipient.name || 'Dear User');

      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      results.push({
        email: recipient.email,
        success: true,
        messageId: result.messageId
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ Broadcast sent to ${results.length} recipients`);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Error sending broadcast email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWelcomeEmail,
  send7DayEmail,
  send30DayEmail,
  sendBroadcastEmail
};
