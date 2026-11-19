// Service Worker for ikA's World — Real-Time Device Announcement Notifications
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {
    title: "🔔 Boss ikA's Sovereign Announcement",
    body: 'A new announcement has been broadcast on ikA\'s World (Section CSE-2).',
    tag: 'ika-announcement',
    url: '/',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      if (parsed && typeof parsed === 'object') {
        payload = {
          title: typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title : payload.title,
          body: typeof parsed.body === 'string' && parsed.body.trim() ? parsed.body : payload.body,
          tag: typeof parsed.tag === 'string' && parsed.tag.trim() ? parsed.tag : payload.tag,
          url: typeof parsed.url === 'string' && parsed.url.startsWith('/') ? parsed.url : '/',
        };
      }
    } catch {
      const fallbackText = event.data.text();
      if (fallbackText) payload.body = fallbackText;
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.tag,
      renotify: true,
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 300],
      data: { url: payload.url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
