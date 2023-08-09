/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* ____________________________________________ */
// ===Service Worker=== //
window.addEventListener('load', async () => {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('/sw.js');
		} catch (a) {
			console.log('service worker register failed');
		}
	}
});
