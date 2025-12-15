// Santvaani Email Service using Brevo
// Simple, affordable, and effective email automation

const brevo = require('@getbrevo/brevo');
require('dotenv').config();

// Initialize Brevo client
let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Email templates
const EMAIL_TEMPLATES = {
  welcome: {
    subject: '🙏 Welcome to Santvaani, {{name}}!',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            padding: 40px 20px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
          }
          .om-symbol {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
            color: #374151;
            line-height: 1.8;
          }
          .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .feature-list {
            background: #fef3c7;
            border-left: 4px solid #ea580c;
            padding: 20px;
            margin: 30px 0;
          }
          .feature-item {
            margin: 12px 0;
            font-size: 16px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            color: white;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 30px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .blessing {
            font-style: italic;
            color: #ea580c;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="om-symbol">🕉️</div>
            <div class="logo">Santvaani</div>
            <p style="color: white; margin: 0;">Your Spiritual Companion</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">Namaste {{name}},</div>

            <p>Welcome to your spiritual home! 🙏</p>

            <p>We're so happy to have you here. Santvaani is more than an app - it's your daily companion for peace, wisdom, and divine connection.</p>

            <div class="feature-list">
              <div style="font-weight: bold; margin-bottom: 15px;">✨ Here's what awaits you:</div>
              <div class="feature-item">🎵 1000+ Devotional Bhajans</div>
              <div class="feature-item">📖 Daily Spiritual Quotes in English & Hindi</div>
              <div class="feature-item">🗓️ Live Panchang & Auspicious Timings</div>
              <div class="feature-item">💬 Santvaani Space - Our Spiritual Community</div>
              <div class="feature-item">🤖 AI Chatbot for Spiritual Guidance</div>
            </div>

            <p><strong>🎁 Your First Step:</strong><br>
            Start with today's quote or listen to a bhajan that speaks to your soul.</p>

            <center>
              <a href="https://santvaani.vercel.app" class="cta-button">
                Open Santvaani App →
              </a>
            </center>

            <div class="blessing">
              "The mind is everything. What you think, you become." - Buddha
            </div>

            <p>With blessings,<br>
            The Santvaani Team 🙏</p>

            <p style="font-size: 14px; color: #6b7280;">
              P.S. We'll check in with you in a week to see how your journey is going!
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2024 Santvaani - Your Digital Ashram</p>
            <p>Spreading peace, one soul at a time 🕉️</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  sevenDays: {
    subject: '🌟 One Week of Spiritual Growth, {{name}}!',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            padding: 40px 20px;
            text-align: center;
          }
          .celebration {
            font-size: 64px;
            margin-bottom: 10px;
          }
          .header-text {
            color: white;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
            color: #374151;
            line-height: 1.8;
          }
          .stats-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
            padding: 30px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
          }
          .stat-item {
            margin: 15px 0;
            font-size: 18px;
          }
          .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #ea580c;
          }
          .quote-box {
            border-left: 4px solid #9333ea;
            padding-left: 20px;
            margin: 30px 0;
            font-style: italic;
            color: #6b7280;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            color: white;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="celebration">🎉</div>
            <div class="header-text">One Week Strong!</div>
          </div>

          <div class="content">
            <p style="font-size: 24px; font-weight: bold; color: #1f2937;">Namaste {{name}},</p>

            <p>It's been a beautiful week with you on Santvaani! 🌟</p>

            <div class="stats-box">
              <div style="font-weight: bold; font-size: 20px; margin-bottom: 20px;">Your Journey So Far</div>
              <div class="stat-item">
                <div class="stat-number">7</div>
                <div>Days of Spiritual Connection</div>
              </div>
              <div class="stat-item">✨ Keep going! You're building something beautiful ✨</div>
            </div>

            <div class="quote-box">
              "A journey of a thousand miles begins with a single step."<br>
              You've taken 7 steps. Keep going! 🚶‍♂️
            </div>

            <p><strong>💫 Did you know?</strong></p>
            <p>You can now join Santvaani Space - our community where we share spiritual wisdom, stories, and support each other's growth.</p>

            <center>
              <a href="https://santvaani.vercel.app/santvaani-space" class="cta-button">
                Explore Santvaani Space →
              </a>
            </center>

            <p>Keep shining,<br>
            The Santvaani Family 🕉️</p>
          </div>

          <div class="footer">
            <p>© 2024 Santvaani - Your Digital Ashram</p>
            <p>Spreading peace, one soul at a time 🕉️</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  thirtyDays: {
    subject: '🎊 30 Days of Transformation, {{name}}!',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #9333ea 100%);
            padding: 50px 20px;
            text-align: center;
          }
          .celebration {
            font-size: 72px;
            margin-bottom: 15px;
          }
          .header-text {
            color: white;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .header-subtitle {
            color: white;
            font-size: 18px;
          }
          .content {
            padding: 40px 30px;
            color: #374151;
            line-height: 1.8;
          }
          .achievement-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #e0e7ff 100%);
            padding: 40px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
          }
          .achievement-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 25px;
          }
          .achievement-item {
            margin: 15px 0;
            font-size: 18px;
          }
          .milestone-number {
            font-size: 48px;
            font-weight: bold;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 20px 0;
          }
          .quote-box {
            background: #1f2937;
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #9333ea 100%);
            color: white;
            padding: 18px 50px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="celebration">🏆</div>
            <div class="header-text">Incredible Milestone!</div>
            <div class="header-subtitle">30 Days of Spiritual Growth</div>
          </div>

          <div class="content">
            <p style="font-size: 28px; font-weight: bold; color: #1f2937; text-align: center;">
              {{name}}, you're AMAZING! 🌟
            </p>

            <p style="font-size: 18px; text-align: center;">
              For 30 days, you've chosen spiritual growth over everything else.<br>
              That's not just a milestone - <strong>that's a transformation</strong>.
            </p>

            <div class="achievement-box">
              <div class="achievement-title">Your Spiritual Journey</div>
              <div class="milestone-number">30</div>
              <div style="font-size: 20px; color: #ea580c; font-weight: bold;">Days of Blessings</div>

              <div style="margin-top: 30px;">
                <div class="achievement-item">🎵 Countless bhajans that touched your soul</div>
                <div class="achievement-item">📖 Wisdom that transformed your thinking</div>
                <div class="achievement-item">💬 Connections in Santvaani Space</div>
                <div class="achievement-item">🙏 Daily moments of peace & reflection</div>
              </div>
            </div>

            <div class="quote-box">
              <div style="font-size: 20px; margin-bottom: 15px;">💫</div>
              <div style="font-size: 18px; font-style: italic;">
                "The soul is neither born, and nor does it die."<br>
                - Bhagavad Gita 2.20
              </div>
              <div style="margin-top: 20px; font-size: 14px; color: #d1d5db;">
                You're proving this truth by nurturing your eternal spirit daily.
              </div>
            </div>

            <p style="text-align: center; font-size: 20px; font-weight: bold; color: #ea580c;">
              🎁 A Special Gift for You
            </p>
            <p style="text-align: center;">
              As a token of our appreciation, we've prepared something special...
            </p>

            <center>
              <a href="https://santvaani.vercel.app" class="cta-button">
                Claim Your Gift →
              </a>
            </center>

            <p style="text-align: center; margin-top: 40px;">
              <strong>Proud of you,</strong><br>
              The Santvaani Family 💝
            </p>

            <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 30px;">
              P.S. Share your journey with friends - spread the light! ✨
            </p>
          </div>

          <div class="footer">
            <p>© 2024 Santvaani - Your Digital Ashram</p>
            <p>Celebrating 30 days of your spiritual transformation 🕉️</p>
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
      email: 'santvaani.digitalashram@gmail.com' // Your verified Brevo email
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
