// Service Worker per gestire le notifiche PWA di Albyfit
const CACHE_NAME = 'albyfit-v0.9.3';
const CURRENT_VERSION = '0.9.3 [RELEASE CANDIDATE]';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
  '/lovable-uploads/8281de93-96f3-4e5c-938a-020cbe3e553d.png'
];

// Installazione del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Attivazione del service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Pulisci cache vecchie
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch events
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Gestione delle notifiche push automatiche
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nuovi aggiornamenti disponibili in Albyfit!',
    icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
    badge: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/?tab=changelog'
    },
    actions: [
      {
        action: 'changelog',
        title: 'Visualizza Changelog',
        icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png'
      },
      {
        action: 'close',
        title: 'Chiudi',
        icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png'
      }
    ],
    requireInteraction: true,
    tag: 'albyfit-changelog'
  };

  event.waitUntil(
    self.registration.showNotification('🚀 Nuovo aggiornamento Albyfit!', options)
  );
});

// Gestione messaggi dal main thread (notifiche admin globali)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SEND_GLOBAL_NOTIFICATION') {
    const { title, body, version, data } = event.data;
    
    const options = {
      body,
      icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
      badge: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
      vibrate: [200, 100, 200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        version,
        url: data.url,
        action: data.action
      },
      actions: [
        {
          action: 'changelog',
          title: 'Vedi Changelog',
          icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png'
        },
        {
          action: 'open',
          title: 'Apri App',
          icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png'
        }
      ],
      requireInteraction: true,
      tag: 'albyfit-admin-notification'
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );

    // Invia conferma al client
    event.ports[0]?.postMessage({ success: true });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Gestione dei click sulle notifiche
self.addEventListener('notificationclick', (event) => {
  console.log('Notifica cliccata: ', event.notification.tag);
  event.notification.close();

  // Gestione azioni specifiche
  if (event.action === 'changelog') {
    event.waitUntil(
      clients.openWindow('/?tab=changelog')
    );
  } else if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    return;
  } else {
    // Click diretto sulla notifica
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Gestione della chiusura delle notifiche
self.addEventListener('notificationclose', (event) => {
  console.log('Notifica chiusa: ', event.notification.tag);
});