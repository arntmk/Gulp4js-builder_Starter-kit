/* ____________________________________________ */
// ===Hamburger menu===

const menu = document.querySelector('.header__navbar');
const menuBtn = document.querySelector('.menu-button');

const { body } = document;

if (menu && menuBtn) {
	menuBtn.addEventListener('click', () => {
		menu.classList.toggle('active');
		menuBtn.classList.toggle('active');
		body.classList.toggle('lock');
		menuBtn.setAttribute('aria-expanded', true);
	});

	menu.addEventListener('click', (e) => {
		if (e.target.classList.contains('header__navbar')) {
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
			menuBtn.setAttribute('aria-expanded', false);
		}
	});

	menu.querySelectorAll('.nav__li-link').forEach((link) => {
		link.addEventListener('click', () => {
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
			menuBtn.setAttribute('aria-expanded', false);
		});
	});
}

/* =========================================== */

// const anchors = document.querySelectorAll('a[href*="#"]');

// anchors.forEach((anchor) => {
//   anchor.addEventListener('click', (event) => {
//     event.preventDefault();

//     const blockID = anchor.getAttribute('href').substring(1);

//     document.getElementById(blockID).scrollIntoView({
//       behavior: 'smooth',
//       block: 'start',
//     });
//   });
// });
