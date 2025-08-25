// Firebase Messaging Service Worker
// This file must be named 'firebase-messaging-sw.js' and be in the public folder

// Import Firebase messaging for background notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase config for background messaging
firebase.initializeApp({
  apiKey: "AIzaSyDhTs33NCwL99qpC0_eC-XohocQSIRJYds",
  authDomain: "santvaani-production.firebaseapp.com",
  projectId: "santvaani-production",
  storageBucket: "santvaani-production.firebasestorage.app",
  messagingSenderId: "343189186122",
  appId: "1:343189186122:web:eedce3bd5bcc83b08968b3"
});

// Initialize Firebase messaging in service worker
const messaging = firebase.messaging();

// Firebase background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('🔥 Background FCM message received:', payload);

  const notificationTitle = payload.notification?.title || '🕉️ SantVaani Daily Blessing';
  const notificationOptions = {
    body: payload.notification?.body || 'New spiritual guidance available!',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'santvaani-fcm',
    data: {
      url: payload.data?.url || '/daily-guide',
      ...payload.data
    },
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open SantVaani',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/daily-guide')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/daily-guide')
    );
  }
});