// 'use strict'; //

/* Base JS imports */
import './scripts/_form';
import serviceWorkerController from './scripts/serviceWorker/_service-worker';
import './scripts/_global';

/* Components JS imports */
import hamburgerController from './components/block-js/_hamburger';

/* Tests */
import './assets/tests/js/_tests';

/* Libs */

// Init | Initialization;
serviceWorkerController();
hamburgerController();
