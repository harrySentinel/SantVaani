const admin = require('firebase-admin');
const cron = require('node-cron');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require('./firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'santvaani-production'
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
  // Morning blessing at 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('🌅 Sending morning blessing notification...');
    await sendNotificationToAll(
      '🌅 Good Morning Blessing',
      'Start your day with divine blessings. Check today\'s spiritual guidance.',
      { 
        url: '/daily-guide',
        type: 'morning-blessing',
        time: 'morning'
      }
    );
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

  // Special festival notifications (can be enhanced with dynamic data)
  cron.schedule('0 9 * * 1', async () => { // Every Monday at 9 AM
    console.log('🎉 Sending weekly spiritual wisdom...');
    await sendNotificationToAll(
      '🕉️ Weekly Spiritual Wisdom',
      'Discover new teachings and divine wisdom for the week ahead.',
      { 
        url: '/saints',
        type: 'weekly-wisdom',
        time: 'weekly'
      }
    );
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