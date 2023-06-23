// https://stackoverflow.com/questions/67584122/how-to-import-constants-from-another-file-in-node-js
// https://formidable.com/blog/2021/node-esm-and-exports/
// https://metanit.com/web/nodejs/2.8.php
/* ____________________________________________ */

const JsFiles = [
	'./src/js/script.js',

	'./src/js/modules/_body-min-width.js',
	'./src/js/modules/_hamburger.js',

	'./src/assets/default/_forms.js',
	'./src/assets/default/_accordion.js',

	'./src/js/modules/**/_*.{js,ts}',
	'./src/components/**/_*.{js,ts}',
];

exports.JsFiles = JsFiles;
