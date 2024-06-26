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
		}, 300);
	},
};

/* ____________________________________________ */
// ===prevent page reload on submit in Form===
const form = document.querySelectorAll('form');
if (form) {
	form.forEach((forms) => {
		forms.addEventListener('submit', (e) => {
			e.preventDefault();
		});
	});
}

/* ____________________________________________ */
// ===Modal===

const modalController = function () {
	const modal = document.querySelector('dialog');
	const openModals = document.querySelectorAll('[data-open-modal]');
	const closeModals = document.querySelectorAll('[data-close-modal]');

	if (modal && openModals && closeModals) {
		// open modal
		openModals.forEach((openModal) =>
			openModal.addEventListener('click', () => {
				scrollController.disableScroll();
				setTimeout(() => {
					modal.showModal();
				}, 200);
			}),
		);

		// close modal
		closeModals.forEach((closeModal) =>
			closeModal.addEventListener('click', () => {
				setTimeout(() => {
					scrollController.enableScroll();
					modal.close();
				}, 100);
			}),
		);

		// click beyond modal to close
		modal.addEventListener('click', (e) => {
			const dialogDimensions = modal.getBoundingClientRect();
			if (
				e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom
			) {
				setTimeout(() => {
					scrollController.enableScroll();
					modal.close();
				}, 300);
			}
		});
	}
};
modalController();

/* ____________________________________________ */
/* ____________________________________________ */
/* ____________________________________________ */
// click beyond modal window to close(old)
/* modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				scrollController.enableScroll();
				modal.close();
			}
		}); */
