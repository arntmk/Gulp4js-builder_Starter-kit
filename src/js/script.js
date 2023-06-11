/* ____________________________________________ */
// Global Script imports ( ./src/script.modules.json )
/* ____________________________________________ */

/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
} */

/* ____________________________________________ */
// ===Disable Scroll===
const headerFixed = document.querySelector('.header');
const { body } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		document.body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px
		`;
		if (window.getComputedStyle(headerFixed).getPropertyValue('position') === 'fixed') {
			headerFixed.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px
		`;
		}
		document.documentElement.style.cssText = 'scroll-behavior: unset; scrollbar-gutter: stable;';
		body.classList.toggle('lock');
	},
	enableScroll() {
		body.classList.remove('lock');
		document.body.style.cssText = '';
		headerFixed.style.paddingRight = '';
		window.scroll({ top: scrollController.scrollPosition });
		document.documentElement.style.cssText = '';
	},
};
