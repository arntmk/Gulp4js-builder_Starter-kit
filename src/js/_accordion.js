/* ____________________________________________ */
// ===Accordion===

const accordion = document.querySelectorAll('details');

if (accordion) {
	accordion.forEach((el) => {
		el.addEventListener('click', (e) => {
			const self = e.currentTarget;
			const content = self.querySelector('.content');

			if (self.hasAttribute('open')) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = `${content.scrollHeight}`;
			}
		});
	});

	// Клик снаружи аркадиона. Закрыть аркадион.
	accordion.forEach((closeDetails) => {
		document.addEventListener('click', (e) => {
			if (!closeDetails.contains(e.target)) {
				closeDetails.removeAttribute('open');
			}
		});
	});

	accordion.forEach((targetDetails) => {
		targetDetails.addEventListener('click', () => {
			accordion.forEach((detail) => {
				if (detail !== targetDetails) {
					detail.removeAttribute('open');
				}
			});
		});
	});
}
