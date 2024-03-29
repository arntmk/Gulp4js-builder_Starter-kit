// 'use strict';

/* Base JS imports */
import serviceWorkerController from './scripts/sw/_service-worker';
import screenViewport from './scripts/_global';

/* Components JS imports */
import hamburgerController from './components/block-js/_hamburger';

/* Libs */

// Init | Initialization;
serviceWorkerController();
screenViewport();
hamburgerController();
