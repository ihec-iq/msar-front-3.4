// Enhanced Service Worker for MSAR ERP PWA
const CACHE_VERSION = 'v1-25.11.02';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE && cache !== API_CACHE) {
                        console.log('[SW] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // API requests - Network First strategy
    if (url.pathname.includes('/api/')) {
        event.respondWith(networkFirstStrategy(request, API_CACHE));
        return;
    }

    // Static assets - Cache First strategy
    if (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font' ||
        request.destination === 'image'
    ) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
        return;
    }

    // HTML pages - Network First strategy
    if (request.destination === 'document' || request.url.endsWith('.html')) {
        event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
        return;
    }

    // Default - Network First
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache First failed:', error);
        return new Response('Offline - Asset not available', {
            status: 503,
            statusText: 'Service Unavailable',
        });
    }
}

// Network First Strategy - for dynamic content and API
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for HTML requests
        if (request.destination === 'document') {
            return new Response(
                `<!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>غير متصل - MSAR ERP</title>
          <style>
            body {
              font-family: 'Tajawal', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .container {
              padding: 2rem;
            }
            h1 { font-size: 3rem; margin-bottom: 1rem; }
            p { font-size: 1.2rem; opacity: 0.9; }
            button {
              margin-top: 2rem;
              padding: 1rem 2rem;
              font-size: 1rem;
              border: 2px solid white;
              background: transparent;
              color: white;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.3s;
            }
            button:hover {
              background: white;
              color: #667eea;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📵 غير متصل بالإنترنت</h1>
            <p>يبدو أنك غير متصل بالإنترنت</p>
            <p>يرجى التحقق من اتصالك والمحاولة مرة أخرى</p>
            <button onclick="location.reload()">إعادة المحاولة</button>
          </div>
        </body>
        </html>`,
                {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                }
            );
        }

        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
        });
    }
}

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('[SW] Background sync triggered');
    // Implement sync logic here
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'إشعار جديد من MSAR ERP',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'MSAR ERP', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
