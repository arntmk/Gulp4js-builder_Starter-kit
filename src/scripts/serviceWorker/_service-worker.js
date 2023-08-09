/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* ____________________________________________ */
// ===SW===
window.addEventListener('load', async () => {
	if ('serviceWorker' in navigator) {
		try {
			const reg = await navigator.serviceWorker.register('/scripts/sw.min.js');
			// console.log('service worker register success', reg);
		} catch (a) {
			console.log('service worker register failed');
		}
	}
});
