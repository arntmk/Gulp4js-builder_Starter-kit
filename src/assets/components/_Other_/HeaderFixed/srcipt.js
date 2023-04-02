/* ____________________________________________ */
// ===Header Fixed===

const navigationHeight = document.querySelector('.header').offsetHeight;

document.documentElement.style.setProperty('--scroll-padding', `${navigationHeight - 1}px`);

/* ____________________________________________ */
const minOffset = 50;
window.onscroll = function () {
	const hasClass = document.body.classList.contains('is_scrolled');

	if (minOffset < document.documentElement.scrollTop) {
		if (!hasClass) {
			document.body.classList.add('is_scrolled');
		}
	} else if (hasClass) {
		document.body.classList.remove('is_scrolled');
	}
};
