/* ____________________________________________ */
// ===Hamburger menu===

const headerfixed = document.querySelector('.header');
const mainfixed = document.querySelector('.main');
const menu = document.querySelector('.header__nav');
const menuBtn = document.querySelector('.menu-button');

const { body } = document;

if (menu && menuBtn) {
	menuBtn.addEventListener('click', () => {
		menu.classList.toggle('active');
		menuBtn.classList.toggle('active');
		body.classList.toggle('lock');
		headerfixed.classList.toggle('header-fixed');
		mainfixed.classList.toggle('main-fixed');
		menuBtn.setAttribute('aria-expanded', true);
	});

	menu.addEventListener('click', (e) => {
		if (e.target.classList.contains('header__nav')) {
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
			headerfixed.classList.remove('header-fixed');
			mainfixed.classList.remove('main-fixed');
			menuBtn.setAttribute('aria-expanded', false);
		}
	});

	menu.querySelectorAll('.nav__li-link').forEach((link) => {
		link.addEventListener('click', () => {
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
			headerfixed.classList.remove('header-fixed');
			mainfixed.classList.remove('main-fixed');
			menuBtn.setAttribute('aria-expanded', false);
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
