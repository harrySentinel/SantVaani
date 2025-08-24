// Firebase configuration for SantVaani
// This is optional - Web Push API works without Firebase too
// Firebase provides better reliability and analytics

// Uncomment and configure when you're ready to use Firebase FCM
/*
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase config (get from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Get registration token for FCM
export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
    
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No FCM token available.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving FCM token:', err);
    return null;
  }
};

// Listen for foreground messages
export const onFCMMessage = (callback: (payload: any) => void) => {
  return onMessage(messaging, callback);
};

export { messaging };
*/

// For now, we'll use the simpler Web Push API approach
// This doesn't require Firebase setup and works immediately

export const initializeNotifications = () => {
  // Check if service worker is supported
  if ('serviceWorker' in navigator) {
    // Register service worker for notifications
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }
};

// Simple notification service without Firebase
export const simpleNotificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) {
      return 'not-supported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  },

  sendNotification: (title: string, options: NotificationOptions = {}) => {
    if (Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
    return null;
  },

  scheduleNotification: (title: string, options: NotificationOptions, delay: number) => {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });
      }
    }, delay);
  }
};