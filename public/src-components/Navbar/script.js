/* ____________________________________________ */
// ===Disable Scroll===
const headerFixed = document.querySelector('.header');
const headerStyle = window.getComputedStyle(headerFixed);
const isFirefoxBrowser = navigator.userAgent.indexOf('Firefox');
const { body } = document;
const { documentElement } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		documentElement.style.cssText = 'scroll-behavior: unset;';
		body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
		if (headerStyle.position === 'fixed' || headerStyle.getPropertyValue('position') === 'fixed') {
			headerFixed.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
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
		}, 300);
	},
};

/* ____________________________________________ */
// https://codepen.io/vaskort/pen/LYpwjoj
// https://hidde.blog/using-javascript-to-trap-focus-in-an-element/
/* ____________________________________________ */
// ===Enable TrapFocus===
const trapFocus = (element) => {
	const focusableEls = Array.from(
		element.querySelectorAll(
			'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"]), audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])',
		),
	);
	const firstFocusableEl = focusableEls[0];

	firstFocusableEl.focus();
};

/* ____________________________________________ */
// ===Hamburger menu===

const hamburgerController = function () {
	const menu = document.querySelector('.header__nav');
	const menuBtn = document.querySelector('.menu-button');

	if (menu && menuBtn) {
		menuBtn.addEventListener('click', () => {
			menu.classList.toggle('active');
			menuBtn.classList.toggle('active');
			menuBtn.setAttribute('aria-expanded', true);
			scrollController.disableScroll();
			trapFocus(menu);
		});

		menu.addEventListener('click', (e) => {
			if (e.target.classList.contains('header__nav')) {
				setTimeout(() => {
					menu.classList.remove('active');
					menuBtn.classList.remove('active');
					menuBtn.setAttribute('aria-expanded', false);
				}, 300);
				scrollController.enableScroll();
			}
		});

		menu.querySelectorAll('.nav__li-link').forEach((link) => {
			link.addEventListener('click', () => {
				setTimeout(() => {
					menu.classList.remove('active');
					menuBtn.classList.remove('active');
					menuBtn.setAttribute('aria-expanded', false);
				}, 100);
				scrollController.enableScroll();
			});
		});
	}

	/* =========================================== */

	/* const anchors = document.querySelectorAll('a[href*="#"]');

anchors.forEach((anchor) => {
	anchor.addEventListener('click', (event) => {
		event.preventDefault();

		const blockID = anchor.getAttribute('href').substring(1);

		document.getElementById(blockID).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	});
});
 */
};
hamburgerController();
