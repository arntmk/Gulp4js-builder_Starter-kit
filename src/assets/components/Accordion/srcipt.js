/* ____________________________________________ */
// ==Accordion==

const accordion = document.querySelectorAll('details');

if (accordion) {
	accordion.forEach((el) => {
		el.addEventListener('click', (e) => {
			const self = e.currentTarget;
			const content = self.querySelector('.content');

			if (self.hasAttribute('open')) {
				content.style.maxHeight = `${content.scrollHeight}px`;
			} else {
				content.style.maxHeight = `${content.scrollHeight}px`;
			}
		});
	});

	accordion.forEach((targetDetail) => {
		targetDetail.addEventListener('click', () => {
			accordion.forEach((detail) => {
				if (detail !== targetDetail) {
					detail.removeAttribute('open');
				}
			});
		});
	});
}
