const admin = require('firebase-admin');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { getTodaysPanchang } = require('./panchang_service');

// Initialize Firebase Admin SDK with secret file
console.log('🔧 Loading Firebase credentials from secret file...');
let serviceAccount;

try {
  const serviceAccountPath = path.join(__dirname, 'firebase-admin-key.json');
  const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountData);
  console.log('✅ Firebase credentials loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Firebase credentials:', error.message);
  console.log('🔧 Attempting to read file directly...');

  // Debug: Check if file exists and show first 100 chars
  try {
    const filePath = path.join(__dirname, 'firebase-admin-key.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log('📝 File exists, length:', content.length);
      console.log('📝 First 100 chars:', content.substring(0, 100));
      console.log('📝 Last 100 chars:', content.substring(content.length - 100));
    } else {
      console.log('❌ File does not exist at:', filePath);
    }
  } catch (debugError) {
    console.error('❌ Debug error:', debugError.message);
  }
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || 'santvaani-production'
});

console.log('🔥 Firebase Admin SDK initialized successfully!');

// In-memory storage for FCM tokens (use database in production)
const fcmTokens = new Set();

// API endpoint to register FCM tokens
const registerFCMToken = (req, res) => {
  const { token, userId, timestamp } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'FCM token is required' });
  }
  
  fcmTokens.add(token);
  console.log(`✅ FCM Token registered: ${token.substring(0, 20)}...`);
  console.log(`📊 Total registered tokens: ${fcmTokens.size}`);
  
  res.json({ 
    success: true, 
    message: 'FCM token registered successfully',
    totalTokens: fcmTokens.size
  });
};

// Send notification to all registered tokens
const sendNotificationToAll = async (title, body, data = {}) => {
  if (fcmTokens.size === 0) {
    console.log('❌ No FCM tokens registered');
    return { success: false, error: 'No tokens registered' };
  }

  const tokensArray = Array.from(fcmTokens);
  
  // Send real FCM notifications using Firebase Admin SDK
  console.log(`🔥 Sending FCM notification to ${tokensArray.length} devices`);
  console.log(`📱 Title: ${title}`);
  console.log(`📝 Body: ${body}`);
  
  const message = {
    notification: {
      title,
      body,
    },
    data: {
      ...data,
      timestamp: new Date().toISOString()
    },
    tokens: tokensArray,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Successfully sent: ${response.successCount}`);
    console.log(`❌ Failed to send: ${response.failureCount}`);
    
    // Remove invalid tokens
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
        console.log(`🗑️ Removing invalid token: ${tokensArray[idx].substring(0, 20)}...`);
        fcmTokens.delete(tokensArray[idx]);
      }
    });
    
    return { 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  } catch (error) {
    console.error('❌ Error sending FCM notification:', error);
    return { success: false, error: error.message };
  }
};

// Daily spiritual notifications scheduler
const scheduleNotifications = () => {
  // Morning blessing at 6:00 AM with dynamic Panchang
  cron.schedule('0 6 * * *', async () => {
    console.log('🌅 Sending morning blessing notification...');
    
    try {
      const panchangData = await getTodaysPanchang();
      const tithi = panchangData.tithi.english || panchangData.tithi.name;
      const isAuspicious = panchangData.isAuspiciousDay;
      
      const title = isAuspicious ? '🌅 शुभ प्रभात - Auspicious Morning' : '🌅 Good Morning Blessing';
      const body = `Today is ${tithi}. ${panchangData.specialMessage}`;
      
      await sendNotificationToAll(title, body, { 
        url: '/daily-guide',
        type: 'morning-blessing',
        time: 'morning',
        tithi: tithi,
        isAuspicious: isAuspicious
      });
    } catch (error) {
      console.error('❌ Error getting Panchang for morning notification:', error);
      // Fallback notification
      await sendNotificationToAll(
        '🌅 Good Morning Blessing',
        'Start your day with divine blessings. Check today\'s spiritual guidance.',
        { 
          url: '/daily-guide',
          type: 'morning-blessing',
          time: 'morning'
        }
      );
    }
  }, {
    timezone: "Asia/Kolkata"
  });

  // Evening prayer at 6:00 PM
  cron.schedule('0 18 * * *', async () => {
    console.log('🌇 Sending evening prayer notification...');
    await sendNotificationToAll(
      '🌇 Evening Prayer Time',
      'Join us for evening prayers and spiritual reflection.',
      { 
        url: '/daily-guide',
        type: 'evening-prayer',
        time: 'evening'
      }
    );
  }, {
    timezone: "Asia/Kolkata"
  });

  // Dynamic festival notifications 
  cron.schedule('0 9 * * 1', async () => { // Every Monday at 9 AM
    console.log('🎉 Checking for upcoming festivals...');
    
    try {
      const panchangData = await getTodaysPanchang();
      const upcomingFestivals = panchangData.festivals.filter(f => f.days <= 3 && f.days > 0);
      
      if (upcomingFestivals.length > 0) {
        const festival = upcomingFestivals[0];
        const daysText = festival.days === 1 ? 'tomorrow' : `in ${festival.days} days`;
        
        await sendNotificationToAll(
          `🎉 ${festival.name} ${daysText}`,
          `Prepare for the sacred festival of ${festival.name}. Get ready for divine celebrations!`,
          { 
            url: '/daily-guide',
            type: 'festival-alert',
            time: 'weekly',
            festival: festival.name,
            days: festival.days
          }
        );
      } else {
        // Regular weekly wisdom if no festivals
        await sendNotificationToAll(
          '🕉️ Weekly Spiritual Wisdom',
          'Discover new teachings and divine wisdom for the week ahead.',
          { 
            url: '/saints',
            type: 'weekly-wisdom',
            time: 'weekly'
          }
        );
      }
    } catch (error) {
      console.error('❌ Error getting festivals for notification:', error);
      // Fallback to regular weekly wisdom
      await sendNotificationToAll(
        '🕉️ Weekly Spiritual Wisdom',
        'Discover new teachings and divine wisdom for the week ahead.',
        { 
          url: '/saints',
          type: 'weekly-wisdom',
          time: 'weekly'
        }
      );
    }
  }, {
    timezone: "Asia/Kolkata"
  });

  console.log('📅 FCM notification scheduler initialized');
  console.log('⏰ Scheduled notifications:');
  console.log('   • Morning Blessing: 6:00 AM IST');
  console.log('   • Evening Prayer: 6:00 PM IST');  
  console.log('   • Weekly Wisdom: Monday 9:00 AM IST');
};

// Manual test notification endpoint
const sendTestNotification = async (req, res) => {
  const { title, body, url } = req.body;
  
  const result = await sendNotificationToAll(
    title || '🧪 Test Notification',
    body || 'This is a test notification from SantVaani backend.',
    { 
      url: url || '/daily-guide',
      type: 'test',
      timestamp: new Date().toISOString()
    }
  );
  
  res.json(result);
};

// Get notification stats
const getNotificationStats = (req, res) => {
  res.json({
    totalRegisteredTokens: fcmTokens.size,
    registeredTokens: Array.from(fcmTokens).map(token => 
      token.substring(0, 20) + '...'
    ),
    scheduledNotifications: [
      { time: '6:00 AM IST', type: 'Morning Blessing', frequency: 'Daily' },
      { time: '6:00 PM IST', type: 'Evening Prayer', frequency: 'Daily' },
      { time: '9:00 AM IST Monday', type: 'Weekly Wisdom', frequency: 'Weekly' }
    ]
  });
};

module.exports = {
  registerFCMToken,
  sendNotificationToAll,
  scheduleNotifications,
  sendTestNotification,
  getNotificationStats
};