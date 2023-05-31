const modalBtn = document.querySelectorAll('.modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modals = document.querySelectorAll('.modal');

modalBtn.forEach((modalbtns) => {
	modalbtns.addEventListener('click', (e) => {
		const path = e.currentTarget.getAttribute('data-path');

		modals.forEach((el) => {
			el.classList.remove('active');
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
