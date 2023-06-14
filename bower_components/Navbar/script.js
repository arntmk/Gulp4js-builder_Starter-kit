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
		documentElement.style.cssText = 'scroll-behavior: unset; scrollbar-gutter: unset;';
		body.classList.toggle('lock');
	},
	enableScroll() {
		setTimeout(() => {
			body.classList.remove('lock');
			body.style.cssText = '';
			headerFixed.style.paddingRight = '';
			window.scroll({ top: scrollController.scrollPosition });
			documentElement.style.cssText = '';
		}, 400);
	},
};

/* ____________________________________________ */
// ===Hamburger menu===

const hamburgerController = function () {
	const menu = document.querySelector('.header__nav');
	const menuBtn = document.querySelector('.menu-button');

	if (menu && menuBtn) {
		menuBtn.addEventListener('click', () => {
			setTimeout(() => {
				menu.classList.toggle('active');
				menuBtn.classList.toggle('active');
				menuBtn.setAttribute('aria-expanded', true);
			}, 200);
			scrollController.disableScroll();
		});

		menu.addEventListener('click', (e) => {
			if (e.target.classList.contains('header__nav')) {
				setTimeout(() => {
					menu.classList.remove('active');
					menuBtn.classList.remove('active');
					menuBtn.setAttribute('aria-expanded', false);
				}, 100);
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
