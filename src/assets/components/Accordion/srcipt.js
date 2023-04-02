/* ____________________________________________ */
// ==Accordion==

const accordion = document.querySelectorAll('details');

if (accordion) {
	accordion.forEach((el) => {
		el.addEventListener('click', (e) => {
			const self = e.currentTarget;
			const content = self.querySelector('.content');

			self.classList.toggle('open');

			if (self.classList.contains('open')) {
				content.style.maxHeight = `${content.scrollHeight}px`;
			} else {
				content.style.maxHeight = null;
			}
		});
	});

	accordion.forEach((targetDetail) => {
		targetDetail.addEventListener('click', () => {
			accordion.forEach((detail) => {
				if (detail !== targetDetail) {
					detail.removeAttribute('open');
					detail.classList.remove('open');
				}
			});
		});
	});
}
