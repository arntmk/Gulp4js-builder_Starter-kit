/* ____________________________________________ */
// ===Modal===

const modalController = function () {
	const modal = document.querySelector('dialog');
	const openModal = document.querySelector('[data-open-modal]');
	const closeModal = document.querySelectorAll('[data-close-modal]');

	const { body } = document;

	if (modal && openModal && closeModal) {
		openModal.addEventListener('click', () => {
			body.classList.toggle('lock');
			modal.showModal();
		});

		closeModal.forEach((item) => item.addEventListener('click', () => {
			body.classList.remove('lock');
			modal.close();
		}));

		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				body.classList.remove('lock');
				modal.close();
			}
		});
	}
};
modalController();
