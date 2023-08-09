/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* ____________________________________________ */
// ===SW===
/* async function loadPosts() {
	const res = await fetch('https://jsonplaceholder.typicode/posts&_limit=1');
	const data = await res.json();

	const container = document.querySelector('#posts');
	container.innerHTML = data.map(toCard).join('/n');
} */

window.addEventListener('load', async () => {
	if ('serviceWorker' in navigator) {
		try {
			const reg = await navigator.serviceWorker.register('/sw.js');
			console.log('service worker register success', reg);
		} catch (a) {
			console.log('service worker register failed');
		}
	}

	// await loadPosts();
});

/* ____________________________________________ */
/* window.addEventListener('load', async () => {
	self.addEventListener('fetch', (e) => {
		console.log(e.request.url);
	});
}); */

/* let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
}); */
