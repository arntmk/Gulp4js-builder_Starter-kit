/* ____________________________________________ */
// ===Disable Scroll===

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
// ===Modal===

const modalController = function () {
	const modal = document.querySelector('dialog');
	const openModals = document.querySelectorAll('button[data-open-modal]');
	const closeModals = document.querySelectorAll('button[data-close-modal]');

	if (modal && openModals && closeModals) {
		openModals.forEach((openModal) =>
			openModal.addEventListener('click', () => {
				scrollController.disableScroll();
				modal.showModal();
			}),
		);

		closeModals.forEach((closeModal) =>
			closeModal.addEventListener('click', () => {
				scrollController.enableScroll();
				modal.close();
			}),
		);

		modal.addEventListener('click', (e) => {
			const dialogDimensions = modal.getBoundingClientRect();
			if (
				e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom
			) {
				scrollController.enableScroll();
				modal.close();
			}
		});
	}
};
modalController();

/* ____________________________________________ */
/* ____________________________________________ */
/* ____________________________________________ */
/* modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				scrollController.enableScroll();
				modal.close();
			}
		}); */
