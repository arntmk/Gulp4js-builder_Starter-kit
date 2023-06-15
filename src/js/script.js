/* ____________________________________________ */
// Global Script imports ( ./src/script.modules.json )
/* ____________________________________________ */

/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
	if (navigator.userAgent.indexOf('Firefox') === -1) {}
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
		if (navigator.userAgent.indexOf('Firefox') === -1) {
			body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px
		`;
		}
		body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px
		`;
		if (style.position === 'fixed' || style.getPropertyValue('position') === 'absolute') {
			headerFixed.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px
		`;
		}
		documentElement.style.cssText = 'scroll-behavior: unset;';
		if (navigator.userAgent.indexOf('Firefox') === -1) {
			body.classList.toggle('lock-fixed');
		}
		if (navigator.userAgent.indexOf('Firefox') !== -1) {
			body.classList.toggle('lock');
		}
	},
	enableScroll() {
		setTimeout(() => {
			body.classList.remove('lock-fixed');
			body.classList.remove('lock');
			body.style.cssText = '';
			body.style.paddingRight = '';
			headerFixed.style.paddingRight = '';
			window.scroll({ top: scrollController.scrollPosition });
			documentElement.style.cssText = '';
		}, 300);
	},
};
