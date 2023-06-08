/* ____________________________________________ */
// Global Script imports ( ./src/script.modules.json )
/* ____________________________________________ */

/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
} */

/* ____________________________________________ */
// ===Disable Scroll===
const { body } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		document.body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px
		`;
		document.documentElement.style.scrollBehavior = 'unset';
		body.classList.toggle('lock');
	},
	enableScroll() {
		body.classList.remove('lock');
		document.body.style.cssText = '';
		window.scroll({ top: scrollController.scrollPosition });
		document.documentElement.style.scrollBehavior = '';
	},
};
