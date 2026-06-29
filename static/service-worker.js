const CACHE_NAME = 'better-at-shea-v2';
const APP_SHELL = [
    '/',
    '/manifest.webmanifest',
    '/static/css/common.css',
    '/static/css/public.css',
    '/static/css/admin.css',
    '/static/js/public.js',
    '/static/js/admin.js',
    '/static/js/app-install.js',
    '/static/images/app-icon.svg',
    '/static/images/generated/better-at-shea-hero.jpg',
    '/static/images/generated/shea-hero-care.jpg',
    '/static/images/generated/shea-leadership-team.jpg',
    '/static/images/generated/shea-therapy-progress.jpg',
    '/static/images/generated/shea-resident-care.jpg',
    '/static/images/generated/shea-hospitality-support.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .catch(() => undefined)
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, clone))
                    .catch(() => undefined);
                return response;
            })
            .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
});
