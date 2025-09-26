const admin = require('firebase-admin');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { getTodaysPanchang } = require('./panchang_service');

// Initialize Firebase Admin SDK with service account
console.log('🔧 Loading Firebase credentials from secret file...');
let serviceAccount;

try {
  serviceAccount = require('./firebase-admin-key.json');
  console.log('✅ Firebase credentials loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Firebase credentials:', error.message);
  console.log('🔧 Creating service account from environment fallback...');

  serviceAccount = {
    type: "service_account",
    project_id: "santvaani-production",
    private_key_id: "ca7e07394390312141b215ae840dddf53a08d553",
    private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC62q9ZRrUXh2Ty
pZMDHW39AcwFV8k28ARbwivihW1ZIHsvw2U7g52hoOPdOhijrTbur7jDmChNiLyS
oVn5vgQOzCrctR8KPdNw0Znx0HvyCIXJnyPh/Jq6ELolwNL5E0fqgeA2U9GJfGTk
xc0By1YF/AUjOyxaLSjd8hKkaPnQWBhGxTJgsbA4+9/nCJo+JLyHgay6BUfVT23j
8i6ICA/EfZObFupek+bUaQ3m+i7/nz06jqT9Mjwa4D6xPvf2US6OVaDQIJgwJ2Vp
otGI4Ot1l3uHn1p5OVo4LG5Zfx2axQoLq/BTQ7skIFMVXb4vmThP1tZ5gdiT2ncB
Xd6KuWbVAgMBAAECggEACTRxs++wRx7z4aI3ek1OWEro3pCDCJJNXKnVmJyjFONt
Ph6dk495yfcPkpvkj9eeH6cHbpdF0P/97ilFsfBi6cm0CNhhVZNTIbkpoMh4+qTh
1lthHKZhhu4BBZAYtI13Gv3X6kU5ytCWddCqtz5pl/Tg2en11uFnpHti4LeNKu6+
YZ4NSvZ0zq5XXk7SPTJr/absSTgWKUkALxuDk48abUVmmV7eu66qngXXdicSf2uv
vAnsv/u8mdmPq4v72eg08eU7zh7XCJ5PeEIt6MMYnWSRTrTP0Wmcj5cuxQ8LOo8n
PTS/4EBptti6q+9gEIpnDxsR85dLaLfAZOasvRMqMQKBgQD0GtxdwPj+xDSQP333
YpOZJrjwARzSjxsd3+H7AUu0Myc9aZFuCZ9kJAcrhXoR+fot1OKOlMq6bkUs31nk
BZb4AAO9ZVKOvKTKCO6B1izHdT23gV4LSVHbW1ITaZdjWeSPJ+VTjkDeV7jiu5U9
xRgkfpqldQ2KPNKmgSEDMZqvCQKBgQDD9aNgVqHqGcbzThVHEtySQ7rTd+WxOwLV
7zujwslc7PmSwJwJWgmypY/gPYm8UubmvcFGlgn5C08vEhxQaRc8iNWee5qF/EPC
dtDDtaMaK3jVP8X3Ra0O4kPoBXK/FQlpYIGAV7ivlJXxd7aAgILGOkoGESlVb48o
+w7vRU3gbQKBgBrXET/lxfsNS9JIiOs4lY4TaeZJ2Qd14L9qLIjS3aYUsc3Y27rD
qBj0tS0d4gwz9kQv0jFnPts84LJMZK/jxXPDXKXojClRqLTmQoNYL1hHFeAlg1eu
WifKZL3psFGmQrFS665CR/OqpZOYmJJQJ5VrrklfE3wNsAPK0vxs6dsxAoGAbwSW
J7lNB/zMmwEsytRjxDW8/ZtatRryk1Ny3Wc4f33+MucOP7oT7nMf3PHgO6JYEHeG
rT/JrJ98n/VJt0CimngHVj8+nxP5K4323jnkiqoATghQVrPRxLHpuOSFSr5XU60K
ETUhe8/ZVzD0Yz7rV/SkBWXpne6TE6uQnXwND80CgYAJB5N1h2d0E+eGACQCImy7
IFKno7D4EW/IS0Yyo5+18dmFlJAXclNPL44+ob7E9UMCWTSgcWYZvNnKlCwccDFo
0zvv/Le88EyRL573uJsIz+xhh/h8TLfFlQGJnC2/A5i+Pd6doerXPRQ7F9Wb1St6
UIKqol8GRuwgJyjl4nTamA==
-----END PRIVATE KEY-----`,
    client_email: "firebase-adminsdk-fbsvc@santvaani-production.iam.gserviceaccount.com",
    client_id: "102596623115142700855",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40santvaani-production.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };

  console.log('✅ Firebase credentials created from fallback');
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'santvaani-production'
});

console.log('🔥 Firebase Admin SDK initialized successfully!');

// Initialize Supabase client for FCM token storage
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log('🗄️ Supabase client initialized for FCM token storage');

// API endpoint to register FCM tokens (now uses database)
const registerFCMToken = async (req, res) => {
  const { token, userId, timestamp } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'FCM token is required' });
  }

  try {
    // Handle user_id: use actual UUID or null for anonymous users
    let validUserId = null;
    if (userId && userId !== 'anonymous' && !userId.startsWith('anonymous-')) {
      validUserId = userId;
    }

    // Insert or update FCM token in database
    const { data, error } = await supabase
      .from('fcm_tokens')
      .upsert({
        user_id: validUserId,
        token: token,
        device_info: {
          userAgent: req.headers['user-agent'] || '',
          timestamp: timestamp || new Date().toISOString()
        },
        is_active: true
      }, {
        onConflict: 'token'
      })
      .select();

    if (error) {
      console.error('❌ Error saving FCM token to database:', error);
      return res.status(500).json({ error: 'Failed to register FCM token' });
    }

    console.log(`✅ FCM Token registered in database: ${token.substring(0, 20)}...`);

    // Get total count of active tokens
    const { count } = await supabase
      .from('fcm_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    console.log(`📊 Total registered tokens in database: ${count}`);

    res.json({
      success: true,
      message: 'FCM token registered successfully in database',
      totalTokens: count,
      tokenId: data[0]?.id
    });
  } catch (error) {
    console.error('❌ Error in registerFCMToken:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Send notification to all registered tokens (now uses database)
const sendNotificationToAll = async (title, body, data = {}) => {
  try {
    // Fetch all active FCM tokens from database
    const { data: tokenRecords, error } = await supabase
      .from('fcm_tokens')
      .select('token, id')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Error fetching FCM tokens from database:', error);
      return { success: false, error: 'Failed to fetch tokens' };
    }

    if (!tokenRecords || tokenRecords.length === 0) {
      console.log('❌ No active FCM tokens found in database');
      return { success: false, error: 'No tokens registered' };
    }

    const tokensArray = tokenRecords.map(record => record.token);

    // Send real FCM notifications using Firebase Admin SDK
    console.log(`🔥 Sending FCM notification to ${tokensArray.length} devices from database`);
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

    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Successfully sent: ${response.successCount}`);
    console.log(`❌ Failed to send: ${response.failureCount}`);

    // Remove invalid tokens from database
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
        console.log(`🗑️ Marking invalid token as inactive: ${tokensArray[idx].substring(0, 20)}...`);
        invalidTokens.push(tokensArray[idx]);
      }
    });

    // Mark invalid tokens as inactive in database
    if (invalidTokens.length > 0) {
      const { error: updateError } = await supabase
        .from('fcm_tokens')
        .update({ is_active: false })
        .in('token', invalidTokens);

      if (updateError) {
        console.error('❌ Error updating invalid tokens:', updateError);
      } else {
        console.log(`✅ Marked ${invalidTokens.length} invalid tokens as inactive`);
      }
    }

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

// Get notification stats (now uses database)
const getNotificationStats = async (req, res) => {
  try {
    // Get total count of active tokens
    const { count: totalTokens } = await supabase
      .from('fcm_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get sample of tokens for display (first 10)
    const { data: sampleTokens } = await supabase
      .from('fcm_tokens')
      .select('token, created_at')
      .eq('is_active', true)
      .limit(10);

    res.json({
      totalRegisteredTokens: totalTokens,
      registeredTokens: sampleTokens?.map(record =>
        record.token.substring(0, 20) + '...'
      ) || [],
      scheduledNotifications: [
        { time: '6:00 AM IST', type: 'Morning Blessing', frequency: 'Daily' },
        { time: '6:00 PM IST', type: 'Evening Prayer', frequency: 'Daily' },
        { time: '9:00 AM IST Monday', type: 'Weekly Wisdom', frequency: 'Weekly' }
      ],
      storageType: 'database'
    });
  } catch (error) {
    console.error('❌ Error getting notification stats:', error);
    res.status(500).json({ error: 'Failed to get notification stats' });
  }
};

module.exports = {
  registerFCMToken,
  sendNotificationToAll,
  scheduleNotifications,
  sendTestNotification,
  getNotificationStats
};