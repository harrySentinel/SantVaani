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
export const getFCMToken = async (): Promise<string | null> => {
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
        
        // Send to backend for database storage
        await sendTokenToBackend(currentToken);
        
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
const sendTokenToBackend = async (token: string) => {
  try {
    const response = await fetch('https://santvaani-backend.onrender.com/api/fcm/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        userId: 'user-' + Date.now(), // Simple user identification
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
      new Notification(payload.notification.title || 'SantVaani', {
        body: payload.notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'santvaani-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open App'
          },
          {
            action: 'close',
            title: 'Dismiss'
          }
        ]
      });
    }
    
    callback(payload);
  });
};

// Production Firebase FCM system is now active!
// All notifications are handled by Firebase for better reliability and delivery.