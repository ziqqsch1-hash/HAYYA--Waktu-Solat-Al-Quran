const CACHE_NAME = 'hayya-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Peringkat Pemasangan (Install)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Peringkat Pengaktifan (Activate)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Peringkat Pengambilan Data (Fetch)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});

// Peringkat Notifikasi Klik (Notification Click)
// Akan memfokuskan atau membuka semula aplikasi apabila notifikasi OS ditekan
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Jika tab aplikasi sudah dibuka, fokus padanya
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tiada tab dibuka, buka tetingkap baharu
      if (clients.openWindow) {
        return clients.openWindow('index.html');
      }
    })
  );
});
