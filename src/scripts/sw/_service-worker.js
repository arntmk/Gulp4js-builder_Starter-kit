/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* ____________________________________________ */
// https://web.dev/install-criteria/
/* ____________________________________________ */
// ===Init serviceWorker=== //
const serviceWorkerController = function () {
	document.addEventListener('DOMContentLoaded', async () => {
		if ('serviceWorker' in navigator) {
			try {
				await navigator.serviceWorker.register('/sw.js');
			} catch (a) {
				console.log('service worker register failed');
			}
		}

		// Prompt Install App
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			window.deferredPrompt = e;
		});
	});
};

export default serviceWorkerController;
