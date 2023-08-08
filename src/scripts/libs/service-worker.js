/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
// https://web.dev/codelab-make-installable/
// https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
/* ____________________________________________ */
// ===Service Worker API===
navigator.serviceWorker.register('/service-worker.js');

window.addEventListener('load', () => {
	self.addEventListener('fetch', (e) => {
		console.log(e.request.url);
	});
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
});
