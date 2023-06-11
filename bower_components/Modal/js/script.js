/* eslint-disable no-shadow */

/* ____________________________________________ */
// ===Disable Scroll===
const headerFixed = document.querySelector('.header');
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
		documentElement.style.cssText = 'scroll-behavior: unset; scrollbar-gutter: stable;';
		body.classList.toggle('lock');
	},
	enableScroll() {
		setTimeout(() => {
			body.classList.remove('lock');
			body.style.cssText = '';
			window.scroll({ top: scrollController.scrollPosition });
			documentElement.style.cssText = '';
		}, 400);
	},
};

/* ____________________________________________ */
// ===Modal Window===
const modalController = function () {
	const modalBtn = document.querySelectorAll('.modal-open-btn');
	const modalBtnClose = document.querySelectorAll('.modal-close-btn');
	const modalOverlay = document.querySelector('.modal-overlay');
	const modals = document.querySelectorAll('.modal');

	if (modalBtn && modalOverlay && modals && modalBtnClose) {
		modalBtn.forEach((modalBtns) => {
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
							modalContent.classList.remove('active');
							modalOverlay.classList.remove('overlay-active');
							scrollController.enableScroll();
							modalBtns.setAttribute('aria-expanded', false);
							modalContent.setAttribute('aria-hidden', true);
						}
					});
					// Закрыть модальное окно Крестикам
					modalBtnClose.forEach((modalBtnsClose) => {
						modalBtnsClose.addEventListener('click', () => {
							modalContent.classList.remove('active');
							modalOverlay.classList.remove('overlay-active');
							scrollController.enableScroll();
						});
					});
				});

				document.querySelector(`[data-target="${path}"]`).classList.add('active');
				modalOverlay.classList.add('overlay-active');
			});
		});

		modalOverlay.addEventListener('click', (e) => {
			if (e.target === modalOverlay) {
				modalOverlay.classList.remove('overlay-active');
				scrollController.enableScroll();
				modals.forEach((modalContent) => {
					modalContent.classList.remove('active');
					scrollController.enableScroll();
					modalContent.setAttribute('aria-hidden', true);
				});
				modalBtn.forEach((modalBtns) => {
					modalBtns.setAttribute('aria-expanded', false);
				});
			}
		});
	}
};
modalController();
