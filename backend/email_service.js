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
    subject: 'Welcome to Santvaani, {{name}}',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

        <p style="font-size: 16px; margin-bottom: 15px;">Namaste {{name}},</p>

        <p style="font-size: 16px; margin-bottom: 15px;">Thank you for joining Santvaani. We're glad to have you here.</p>

        <p style="font-size: 16px; margin-bottom: 15px;">Santvaani is your digital spiritual companion. Here's what you can explore:</p>

        <ul style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">
          <li><strong>Devotional Bhajans</strong> - Sacred music and live streams</li>
          <li><strong>Bhagavad Gita AI Chatbot</strong> - Get guidance from ancient wisdom</li>
          <li><strong>Santvaani Space</strong> - Connect with fellow spiritual seekers</li>
          <li><strong>Daily Horoscope</strong> - Personalized Vedic astrology insights</li>
          <li><strong>Museum of Saints</strong> - Learn about divine masters</li>
          <li><strong>Spiritual Blogs</strong> - Deep teachings and philosophy</li>
        </ul>

        <p style="font-size: 16px; margin-bottom: 15px;">Visit your dashboard to get started: <a href="https://santvaani.com" style="color: #ea580c; text-decoration: none;">santvaani.com</a></p>

        <p style="font-size: 16px; margin-bottom: 15px; font-style: italic; color: #666; border-left: 3px solid #ea580c; padding-left: 15px;">"The soul is neither born, and nor does it die." - Bhagavad Gita 2.20</p>

        <p style="font-size: 16px; margin-bottom: 10px;">With blessings,<br><strong>The Santvaani Team</strong></p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #999; text-align: center;">
          Santvaani Digital Ashram<br>
          <a href="https://santvaani.com" style="color: #ea580c; text-decoration: none;">santvaani.com</a>
        </p>

      </body>
      </html>
    `
  },

  sevenDays: {
    subject: '7 days with Santvaani, {{name}}',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

        <p style="font-size: 16px; margin-bottom: 15px;">Namaste {{name}},</p>

        <p style="font-size: 16px; margin-bottom: 15px;">It's been one week since you joined Santvaani. We wanted to check in and see how your journey is going.</p>

        <p style="font-size: 16px; margin-bottom: 15px;">Building a spiritual practice takes commitment, and you're showing up. That's worth celebrating.</p>

        <p style="font-size: 16px; margin-bottom: 15px; font-style: italic; color: #666; border-left: 3px solid #ea580c; padding-left: 15px;">"A journey of a thousand miles begins with a single step." - Lao Tzu</p>

        <p style="font-size: 16px; margin-bottom: 15px;"><strong>Continue exploring:</strong></p>

        <ul style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">
          <li><strong>Santvaani Space</strong> - Connect with our spiritual community</li>
          <li><strong>Gita AI Chatbot</strong> - Ask questions, get wisdom from Bhagavad Gita</li>
          <li><strong>Event Management</strong> - Organize your Bhagwat Katha or Paath</li>
        </ul>

        <p style="font-size: 16px; margin-bottom: 15px;">Visit: <a href="https://santvaani.com/santvaani-space" style="color: #ea580c; text-decoration: none;">santvaani.com/santvaani-space</a></p>

        <p style="font-size: 16px; margin-bottom: 10px;">Keep shining,<br><strong>The Santvaani Team</strong></p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #999; text-align: center;">
          Santvaani Digital Ashram<br>
          <a href="https://santvaani.com" style="color: #ea580c; text-decoration: none;">santvaani.com</a>
        </p>

      </body>
      </html>
    `
  },

  thirtyDays: {
    subject: '30 days with Santvaani, {{name}}',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

        <p style="font-size: 16px; margin-bottom: 15px;">Namaste {{name}},</p>

        <p style="font-size: 16px; margin-bottom: 15px;">Thirty days. A whole month of spiritual practice with Santvaani.</p>

        <p style="font-size: 16px; margin-bottom: 15px;">You've shown incredible dedication. Building a consistent practice is one of the most powerful things you can do for your spiritual growth, and you're doing it.</p>

        <p style="font-size: 16px; margin-bottom: 15px; font-weight: bold; background: #f9fafb; padding: 20px; border-left: 4px solid #ea580c;">30 days of choosing wisdom, peace, and divine connection.</p>

        <p style="font-size: 16px; margin-bottom: 15px; font-style: italic; color: #666; border-left: 3px solid #ea580c; padding-left: 15px;">"नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।<br>न चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥"<br><br>The soul is neither born, nor does it die. The soul is eternal, unchanging, and immovable.<br>- Bhagavad Gita 2.23</p>

        <p style="font-size: 16px; margin-bottom: 15px;">Your commitment to nurturing your soul daily is transforming you from within.</p>

        <p style="font-size: 16px; margin-bottom: 15px;"><strong>Keep exploring Santvaani:</strong></p>

        <ul style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">
          <li>Share your journey in Santvaani Space</li>
          <li>Deepen your practice with daily bhajans</li>
          <li>Explore teachings in our spiritual blog</li>
          <li>Organize community events</li>
        </ul>

        <p style="font-size: 16px; margin-bottom: 15px;">This is just the beginning. <a href="https://santvaani.com" style="color: #ea580c; text-decoration: none;">Continue your journey</a></p>

        <p style="font-size: 16px; margin-bottom: 10px;">Proud of you,<br><strong>The Santvaani Family</strong></p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #999; text-align: center;">
          Santvaani Digital Ashram<br>
          <a href="https://santvaani.com" style="color: #ea580c; text-decoration: none;">santvaani.com</a>
        </p>

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
      email: 'noreply@santvaani.com'
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
      email: 'noreply@santvaani.com'
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
      email: 'noreply@santvaani.com'
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
        email: 'noreply@santvaani.com'
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
