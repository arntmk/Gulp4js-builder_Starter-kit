/* ____________________________________________ */
// ===Modal===

const modal = document.querySelector('dialog');
const openModal = document.querySelector('[data-open-modal]');
const closeModal = document.querySelectorAll('[data-close-modal]');

const { body } = document;

if (modal && openModal && closeModal) {
	openModal.addEventListener('click', () => {
		body.classList.toggle('modal-open');
		modal.showModal();
	});

	closeModal.forEach((item) => item.addEventListener('click', () => {
		body.classList.remove('modal-open');
		modal.close();
	}));

	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			body.classList.remove('modal-open');
			modal.close();
		}
	});
}
