/* eslint-disable no-shadow */

/* ____________________________________________ */
// ===Disable Scroll===

const isFirefoxBrowser = navigator.userAgent.indexOf('Firefox');
const { body } = document;
const { documentElement } = document;

const scrollController = {
	scrollPosition: 0,
	disableScroll() {
		scrollController.scrollPosition = window.scrollY;
		documentElement.style.cssText = 'scroll-behavior: unset;';
		body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px
		`;
		if (isFirefoxBrowser === -1) {
			body.style.cssText = `
		top: -${scrollController.scrollPosition}px;
		padding-right: ${window.innerWidth - document.body.offsetWidth}px
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
			window.scroll({ top: scrollController.scrollPosition });
			documentElement.style.cssText = '';
		}, 400);
	},
};

/* ____________________________________________ */
// ===prevent page reload on submit===
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
	e.preventDefault();
});

/* ____________________________________________ */
// ===Modal Window===
const modalController = function () {
	const modalBtnOpen = document.querySelectorAll('.modal-open-btn');
	const modalBtnClose = document.querySelectorAll('.modal-close-btn');
	const modalOverlay = document.querySelector('.modal-overlay');
	const modals = document.querySelectorAll('.modal');

	if (modalBtnOpen && modalOverlay && modals && modalBtnClose) {
		modalBtnOpen.forEach((modalBtns) => {
			modalBtns.addEventListener('click', (e) => {
				const path = e.currentTarget.getAttribute('data-path');
				scrollController.disableScroll();
				modalBtns.setAttribute('aria-expanded', true);

				modals.forEach((modalContent) => {
					modalContent.classList.remove('active');
					modalContent.setAttribute('aria-hidden', false);

					// Закрыть модальное окно при нажатии на Tab or Esc
					document.addEventListener('keydown', (e) => {
						if (e.key === 'Escape') {
							setTimeout(() => {
								modalContent.classList.remove('active');
								modalOverlay.classList.remove('overlay-active');
								scrollController.enableScroll();
								modalBtns.setAttribute('aria-expanded', false);
								modalContent.setAttribute('aria-hidden', true);
							}, 200);
						}
					});
					// Закрыть модальное окно Крестикам
					modalBtnClose.forEach((modalBtnsClose) => {
						modalBtnsClose.addEventListener('click', () => {
							setTimeout(() => {
								modalContent.classList.remove('active');
								modalOverlay.classList.remove('overlay-active');
								scrollController.enableScroll();
							}, 200);
						});
					});
				});

				document.querySelector(`[data-target="${path}"]`).classList.add('active');
				modalOverlay.classList.add('overlay-active');
			});
		});

		modalOverlay.addEventListener('click', (e) => {
			if (e.target === modalOverlay) {
				setTimeout(() => {
					modalOverlay.classList.remove('overlay-active');
					scrollController.enableScroll();
				}, 200);
				modals.forEach((modalContent) => {
					setTimeout(() => {
						modalContent.classList.remove('active');
						scrollController.enableScroll();
						modalContent.setAttribute('aria-hidden', true);
					}, 200);
				});
				modalBtnOpen.forEach((modalBtns) => {
					modalBtns.setAttribute('aria-expanded', false);
				});
			}
		});
	}
};
modalController();
