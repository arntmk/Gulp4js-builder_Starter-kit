// 'use strict'; //

/* Base JS imports */
import form from './scripts/_form';
import serviceWorkerController from './scripts/sw/_service-worker';
import screenViewport from './scripts/_global';

/* Components JS imports */
import hamburgerController from './components/block-js/_hamburger';

/* Tests */
import './assets/tests/js/_tests';

/* Libs */

// Init | Initialization;
form();
serviceWorkerController();
screenViewport();
hamburgerController();
