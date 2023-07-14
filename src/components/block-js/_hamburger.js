/* ____________________________________________ */
// ===Hamburger menu===
import scrollController from '../../scripts/export/_disable-scroll';
import trapFocus from '../../scripts/export/_trap-focus';

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
	}); */
};
hamburgerController();
