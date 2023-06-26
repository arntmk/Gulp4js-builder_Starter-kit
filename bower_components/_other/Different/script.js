/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
	if (navigator.userAgent.indexOf('Firefox') === -1) {}
} */

/* ____________________________________________ */
/* https://www.tutorialspoint.com/how-to-stop-refreshing-the-page-on-submit-in-javascript */
/* https://timetoprogram.com/prevent-page-reload-form-submit-react-js/ */
/* https://stackoverflow.com/questions/14589193/clearing-my-form-inputs-after-submission */
/* ____________________________________________ */
// ===prevent page reload on submit===
const form = document.querySelectorAll('form');
if (form) {
	form.forEach((forms) => {
		forms.addEventListener('submit', (e) => {
			e.preventDefault();
		});
	});
}

/* ____________________________________________ */
// ===prevent page to scroll up on link===
const link = document.querySelectorAll('a[href="#"]');
link.forEach((links) => {
	links.addEventListener('click', (e) => {
		e.preventDefault();
	});
});

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

/* ____________________________________________ */
// https://codepen.io/vaskort/pen/LYpwjoj
// https://hidde.blog/using-javascript-to-trap-focus-in-an-element/
/* ____________________________________________ */
// ===trapFocus===
const trapFocus = (element) => {
	const focusableEls = Array.from(
		element.querySelectorAll(
			'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"]), audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])',
		),
	);
	const firstFocusableEl = focusableEls[0];

	firstFocusableEl.focus();
};
