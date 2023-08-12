/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* ____________________________________________ */
// https://web.dev/codelab-make-installable/
// https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
// https://www.youtube.com/watch?v=ifroMW_F4Sc - 45:35 ( WorkBox )
// https://www.youtube.com/watch?v=kV9Gq6FrABg
// https://www.youtube.com/watch?v=q5RLP-CDMvs
/* ____________________________________________ */
// console.log('[SW]: install');
// console.log('[SW]: activate');
// console.log('fetch', e.request.url);
/* ____________________________________________ */
// ===Service Worker=== //

// Cache Filies & Versions
const version = '2';
const staticCacheName = `s-app-v${version}`;
const dynamicCacheName = `d-app-v${version}`;
const assetUrls = ['/', '/index.html', '/offline.html', '/404.html'];

// InitCache
/* self.addEventListener('install', async (e) => {
	const cache = await caches.open(staticCacheName);
	await cache.addAll(assetUrls);
}); */

// InitCache
self.addEventListener('install', (e) => {
	// e.waitUntil(caches.open(staticCacheName).then((cache) => cache.addAll(assetUrls)));
	e.waitUntil(
		caches.open(staticCacheName).then(
			(cache) => {
				return cache.addAll(assetUrls);
			},
			(error) => {
				console.log(error);
			},
		),
	);
});

// Delete Old Cache
self.addEventListener('activate', async () => {
	const cachedNames = await caches.keys();
	await Promise.all(
		cachedNames
			.filter((name) => name !== staticCacheName)
			.filter((name) => name !== dynamicCacheName)
			.map((name) => caches.delete(name)),
	);
});

// Request Cache
self.addEventListener('fetch', (e) => {
	const { request } = e;
	if (URL.origin === location.origin) {
		e.respondWith(cacheFirst(request));
	} else {
		e.respondWith(networkFirst(request));
	}
});

/* async function cacheFirst(request) {
	const cached = await caches.match(request);
	return cached ?? (await fetch(request));
} */

function cacheFirst(e) {
	const { request } = e;
	return caches.match(request).then((cached) => {
		return cached || fetch(request);
	});
}

async function networkFirst(request) {
	const cache = await caches.open(dynamicCacheName);
	try {
		const response = await fetch(request);
		await cache.put(request, response.clone());
		return response;
	} catch (e) {
		const cached = await cache.match(request);
		return cached ?? (await caches.match('/offline.html'));
	}
}
