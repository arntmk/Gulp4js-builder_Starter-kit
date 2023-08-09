/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* ____________________________________________ */
// ===SW===
window.addEventListener('load', async () => {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('/scripts/sw.min.js');
		} catch (a) {
			console.log('service worker register failed');
		}
	}
});
