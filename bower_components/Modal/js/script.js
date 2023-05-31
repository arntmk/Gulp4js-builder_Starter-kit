/* eslint-disable no-shadow */
const modalBtn = document.querySelectorAll('.modal-open-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modals = document.querySelectorAll('.modal');
const modalBtnClose = document.querySelectorAll('.modal-close-btn');

const { body } = document;

if (modalBtn && modalOverlay && modals && modalBtnClose) {
	modalBtn.forEach((modalBtns) => {
		modalBtns.addEventListener('click', (e) => {
			const path = e.currentTarget.getAttribute('data-path');
			body.classList.add('modal-open');
			modalBtns.setAttribute('aria-expanded', true);

			modals.forEach((modalContent) => {
				modalContent.classList.remove('active');
				modalContent.setAttribute('aria-hidden', false);

				// Закрыть модальное окно при нажатии на Tab or Esc
				document.addEventListener('keydown', (e) => {
					if (e.key === 'Tab' || e.key === 'Escape') {
						modalContent.classList.remove('active');
						modalOverlay.classList.remove('overlay-active');
						body.classList.remove('modal-open');
						modalBtns.setAttribute('aria-expanded', false);
						modalContent.setAttribute('aria-hidden', true);
					}
				});
				// Закрыть модальное окно крестикам
				modalBtnClose.forEach((modalBtnsClose) => {
					modalBtnsClose.addEventListener('click', () => {
						modalContent.classList.remove('active');
						modalOverlay.classList.remove('overlay-active');
						body.classList.remove('modal-open');
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
			body.classList.remove('modal-open');
			modals.forEach((modalContent) => {
				modalContent.classList.remove('active');
				body.classList.remove('modal-open');
				modalContent.setAttribute('aria-hidden', true);
			});
			modalBtn.forEach((modalBtns) => {
				modalBtns.setAttribute('aria-expanded', false);
			});
		}
	});
}
