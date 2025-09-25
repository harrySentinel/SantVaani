// Firebase configuration for SantVaani Production
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Production Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDhTs33NCwL99qpC0_eC-XohocQSIRJYds",
  authDomain: "santvaani-production.firebaseapp.com",
  projectId: "santvaani-production",
  storageBucket: "santvaani-production.firebasestorage.app",
  messagingSenderId: "343189186122",
  appId: "1:343189186122:web:eedce3bd5bcc83b08968b3",
  measurementId: "G-ZHVJ87Y1C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

// VAPID Key for Web Push
const VAPID_KEY = 'BOHsxh4_Bh_ZN2_AoI756MFJ17huLW1nb96HVd624K9qnmnie2GMdgr9QO3rHmx_Q_QTtzTKcXfalx0naQJ1z8o';

// Production FCM Token Management
export const getFCMToken = async (userId?: string): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });

      if (currentToken) {
        console.log('🔥 FCM Token Generated:', currentToken);
        // Store token for backend use
        localStorage.setItem('fcm-token', currentToken);

        // Send to backend for database storage with user ID
        await sendTokenToBackend(currentToken, userId);

        return currentToken;
      } else {
        console.log('❌ No FCM token available');
        return null;
      }
    } else {
      console.log('❌ Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
};

// Send token to backend for scheduling notifications
const sendTokenToBackend = async (token: string, userId?: string) => {
  try {
    const backendUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://santvaani-backend.onrender.com';
    const response = await fetch(`${backendUrl}/api/fcm/register-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId: userId || 'anonymous-' + Date.now(),
        timestamp: new Date().toISOString()
      }),
    });

    if (response.ok) {
      console.log('✅ Token registered with backend');
    } else {
      console.error('❌ Failed to register token with backend');
    }
  } catch (error) {
    console.error('❌ Error sending token to backend:', error);
  }
};

// Listen for foreground messages
export const onFCMMessage = (callback: (payload: any) => void) => {
  return onMessage(messaging, (payload) => {
    console.log('📱 Foreground message received:', payload);
    
    // Show browser notification even in foreground
    if (payload.notification) {
      console.log('📱 Creating browser notification:', payload.notification);
      try {
        const notification = new Notification(payload.notification.title || 'SantVaani', {
          body: payload.notification.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'santvaani-notification',
          requireInteraction: true
        });

        notification.onclick = function(event) {
          console.log('📱 Notification clicked!');
          window.focus();
          event.target.close();
        };

        notification.onshow = function() {
          console.log('📱 Notification shown!');
        };

        notification.onclose = function() {
          console.log('📱 Notification closed!');
        };

        console.log('📱 Browser notification created successfully:', notification);
      } catch (error) {
        console.error('📱 Error creating browser notification:', error);
      }
    } else {
      console.log('📱 No notification payload found:', payload);
    }
    
    callback(payload);
  });
};

// Production Firebase FCM system is now active!
// All notifications are handled by Firebase for better reliability and delivery.