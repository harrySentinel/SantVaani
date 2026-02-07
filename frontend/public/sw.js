// Service Worker for Santvaani Firebase FCM Notifications
// This handles background notifications, Firebase messaging, and caching

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

const CACHE_NAME = 'santvaani-v3';
const urlsToCache = [
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - network-first for pages, cache-first only for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Never intercept API, auth, or external requests
  const isApiRequest = url.pathname.includes('/api/') ||
                       url.hostname.includes('supabase.co') ||
                       url.hostname.includes('googleapis.com');
  if (isApiRequest) return;

  // Navigation requests (HTML pages) — ALWAYS network-first
  // This ensures new tabs always get the latest code
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets (JS, CSS, images) — network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Firebase background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('🔥 Background FCM message received:', payload);

  const notificationTitle = payload.notification?.title || '🕉️ Santvaani Daily Blessing';
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
        title: 'Open Santvaani',
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

// Push event - handle background notifications (fallback for non-FCM)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New spiritual guidance available!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'santvaani-notification',
    data: {
      url: '/daily-guide'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Santvaani',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🕉️ Santvaani Daily Blessing', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/daily-guide')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/daily-guide')
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync offline actions when connection is restored
  return fetch('/api/sync')
    .then(response => {
      // Handle sync response
    })
    .catch(error => {
      console.log('Background sync failed:', error);
    });
}