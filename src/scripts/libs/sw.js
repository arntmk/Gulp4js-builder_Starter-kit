/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
// https://web.dev/codelab-make-installable/
// https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
/* ____________________________________________ */
// ===Service Worker API===

self.addEventListener('install', (event) => {
	console.log('[SW]: install');
});

self.addEventListener('activate', (event) => {
	console.log('[SW]: activate');
});
