/* ____________________________________________ */
// ===disable scroll===
const headerFixed = document.querySelector('.header');
const headerStyle = window.getComputedStyle(headerFixed);
const isFirefoxBrowser = navigator.userAgent.indexOf('Firefox');
const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;
const { body } = document;
const { documentElement } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		documentElement.style.cssText = 'scroll-behavior: unset;';
		body.style.paddingRight = paddingOffset;
		if (
			headerStyle.position === 'fixed' ||
			headerStyle.getPropertyValue('position') === 'absolute'
		) {
			headerFixed.style.paddingRight = paddingOffset;
		}
		if (isFirefoxBrowser === -1) {
			body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px;
		`;
			body.classList.toggle('lock-fixed');
		}
		if (isFirefoxBrowser !== -1) {
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
		}, 400);
	},
};

export default scrollController;
