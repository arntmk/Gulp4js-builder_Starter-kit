'use strict';
/* ____________________________________________ */

const navigationHeight = document.querySelector('.header').offsetHeight;

document.documentElement.style.setProperty(
	'--scroll-padding',
	navigationHeight - 1 + 'px'
);

/* ____________________________________________ */
const minOffset = 50;
window.onscroll = function () {
	let has_class = document.body.classList.contains('is_scrolled');

	if (minOffset < document.documentElement.scrollTop) {
		if (!has_class) {
			document.body.classList.add('is_scrolled');
		}
	} else if (has_class) {
		document.body.classList.remove('is_scrolled');
	}
};
