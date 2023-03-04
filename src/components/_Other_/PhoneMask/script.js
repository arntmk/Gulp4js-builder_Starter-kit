// https://www.youtube.com/watch?v=3bQO_sVFXvM&t=287s
// Сылька на плагин https://imask.js.org/
// Подключаем через npm: https://www.npmjs.com/package/imask
// Подключаем через CDN: <script src="https://unpkg.com/imask"></script>

'use strict';

/* ____________________________________________ */
// Init phonemask
const maskElement = document.querySelector('#phone__input');
const maskOption = {
	mask: '+{38}(000)000-00-00',
};
const mask = IMask(maskElement, maskOption);
