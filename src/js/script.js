/* ____________________________________________ */
// Global Script imports ( ./src/script.modules.json )
/* ____________________________________________ */

/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
} */

/* ____________________________________________ */
// ===Disable Scroll===
const headerFixed = document.querySelector('.header');
const style = window.getComputedStyle(headerFixed);
const { body } = document;
const { documentElement } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px
		`;
		if (style.position === 'fixed' || style.getPropertyValue('position') === 'absolute') {
			headerFixed.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px
		`;
		}
		documentElement.style.cssText = 'scroll-behavior: unset; scrollbar-gutter: stable;';
		body.classList.toggle('lock');
	},
	enableScroll() {
		body.classList.remove('lock');
		body.style.cssText = '';
		headerFixed.style.paddingRight = '';
		window.scroll({ top: scrollController.scrollPosition });
		setTimeout(() => {
			documentElement.style.cssText = '';
		}, 400);
	},
};
