/* ____________________________________________ */
// ===Hamburger menu===
const { body } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		document.body.classList.toggle('lock');
		document.body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px
		`;
		document.documentElement.style.scrollBehavior = 'unset';
	},
	enableScroll() {
		document.body.classList.remove('lock');
		document.body.style.cssText = '';
		window.scroll({ top: scrollController.scrollPosition });
		document.documentElement.style.scrollBehavior = '';
	},
};

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
