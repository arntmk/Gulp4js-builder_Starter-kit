/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
// https://web.dev/codelab-make-installable/
// https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
/* ____________________________________________ */
// ===Service Worker API===

const staticCacheName = 's-app-v1';
const assetUrls = ['/index.html'];

// Cache Files
self.addEventListener('install', async (e) => {
	e.waitUntil(caches.open(staticCacheName).then((cache) => cache.addAll(assetUrls)));
});

// Cache Clear
self.addEventListener('activate', async (e) => {
	const cachedNames = await caches.keys();
	await Promise.all(
		cachedNames.filter((name) => name !== staticCacheName).map((name) => caches.delete(name)),
	);
});

// Cache Request
self.addEventListener('fetch', (e) => {
	e.respondWith(cacheFirst(e.request));
});

async function cacheFirst(request) {
	const cached = await caches.match(request);
	return cached ?? (await fetch(request));
}

/* 	const cache = await caches.open(staticCacheName);
	await cache.addAll(assetUrls); */
// console.log('[SW]: install');
// console.log('[SW]: activate');
// console.log('fetch', e.request.url);
