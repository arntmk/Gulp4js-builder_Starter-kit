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
				scrollController.disableScroll();
			}, 100);
		});

		menu.addEventListener('click', (e) => {
			if (e.target.classList.contains('header__nav')) {
				setTimeout(() => {
					menu.classList.remove('active');
					menuBtn.classList.remove('active');
					menuBtn.setAttribute('aria-expanded', false);
					scrollController.enableScroll();
				}, 100);
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
