const STATIC_CACHE_NAME = 'static-cache-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1';

const APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            console.log('[Service Worker] Precaching App Shell');
            return cache.addAll(APP_SHELL_FILES);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return from cache if found. This works for GET requests.
                // For POST requests, match will be undefined, and it will proceed to fetch.
                if (response) {
                    return response;
                }

                // If not in cache, fetch from network
                return fetch(event.request).then(res => {
                    // Don't cache POST requests (e.g., Gemini API calls)
                    if (event.request.method === 'POST') {
                        return res;
                    }
                    // For GET requests, open dynamic cache, put the new response, and return it
                    return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        cache.put(event.request.url, res.clone());
                        return res;
                    });
                });
            })
    );
});
