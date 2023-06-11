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
		headerFixed.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px
		`;
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
		});

		menu.addEventListener('click', (e) => {
			if (e.target.classList.contains('header__nav')) {
				menu.classList.remove('active');
				menuBtn.classList.remove('active');
				menuBtn.setAttribute('aria-expanded', false);
				scrollController.enableScroll();
			}
		});

		menu.querySelectorAll('.nav__li-link').forEach((link) => {
			link.addEventListener('click', () => {
				menu.classList.remove('active');
				menuBtn.classList.remove('active');
				menuBtn.setAttribute('aria-expanded', false);
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
