// Service Worker for SantVaani Notifications
// This handles background notifications and caching

const CACHE_NAME = 'santvaani-v1';
const urlsToCache = [
  '/',
  '/daily-guide',
  '/saints',
  '/living-saints',
  '/divine',
  '/bhajans',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push event - handle background notifications
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
        title: 'Open SantVaani',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🕉️ SantVaani Daily Blessing', options)
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