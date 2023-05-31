/* eslint-disable no-shadow */
const modalBtn = document.querySelectorAll('.modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modals = document.querySelectorAll('.modal');

modalBtn.forEach((modalbtns) => {
	modalbtns.addEventListener('click', (e) => {
		const path = e.currentTarget.getAttribute('data-path');

		modals.forEach((el) => {
			el.classList.remove('active');

			// Закрыть модальное окно при нажатии на Tab or Esc
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Tab' || e.key === 'Escape') {
					el.classList.remove('active');
					modalOverlay.classList.remove('overlay-active');
				}
			});
		});

		document.querySelector(`[data-target="${path}"]`).classList.add('active');
		modalOverlay.classList.add('overlay-active');
	});
});

modalOverlay.addEventListener('click', (e) => {
	if (e.target === modalOverlay) {
		modalOverlay.classList.remove('overlay-active');
		modals.forEach((el) => {
			el.classList.remove('active');
		});
	}
});
