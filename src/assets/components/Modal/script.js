/* ____________________________________________ */
// ===Modal===

const modal = document.querySelector('dialog');
const openModal = document.querySelector('[data-modal="openModal"]');
const closeModal = document.querySelectorAll('[data-modal="closeModal"]');

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
