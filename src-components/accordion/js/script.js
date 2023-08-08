/* ____________________________________________ */
// ==AccordionJS==

const accordionsController = function () {
	const accordions = document.querySelectorAll('.accordion');

	// Клик по аккордеону. Закрыть другой акардион
	/* 	function removeActive(index1) {
		accordions.forEach((item2, index2) => {
			if (index1 !== index2) {
				item2.classList.remove('active');

				const accordionBtn2 = item2.querySelector('.accordion-button');
				const content2 = item2.querySelector('.accordion-content');
				content2.style.maxHeight = '';
				accordionBtn2.setAttribute('aria-expanded', false);
				content2.setAttribute('aria-hidden', true);
			}
		});
	} */

	if (accordions) {
		accordions.forEach((item, index) => {
			const accordionBtn = item.querySelector('.accordion-button');
			const content = item.querySelector('.accordion-content');
			accordionBtn.addEventListener('click', () => {
				item.classList.toggle('active');

				if (item.classList.contains('active')) {
					content.style.maxHeight = `${content.scrollHeight}px`;
					accordionBtn.setAttribute('aria-expanded', true);
					content.setAttribute('aria-hidden', false);
				} else {
					content.style.maxHeight = '';
					accordionBtn.setAttribute('aria-expanded', false);
					content.setAttribute('aria-hidden', true);
				}
				// removeActive(index);
			});
			// Клик снаружи акардиона. Закрыть акардион
			document.addEventListener('click', (e) => {
				if (!item.contains(e.target)) {
					content.style.maxHeight = '';
					item.classList.remove('active');
					accordionBtn.setAttribute('aria-expanded', false);
					content.setAttribute('aria-hidden', true);
				}
			});
			// Нажатие на Tab или Escape. Закрыть акардион
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Tab' || e.key === 'Escape') {
					content.style.maxHeight = '';
					item.classList.remove('active');
					accordionBtn.setAttribute('aria-expanded', false);
					content.setAttribute('aria-hidden', true);
				}
			});
		});
	}
};
accordionsController();
