/* ____________________________________________ */
// ==Accordion==

const accordions = document.querySelectorAll('.accordion');

function removeOpen(index1) {
	accordions.forEach((item2, index2) => {
		if (index1 !== index2) {
			item2.classList.remove('active');

			const accordionBtn2 = item2.querySelector('.accordion-button');
			const content2 = item2.querySelector('.accordion-content');
			content2.style.maxHeight = '0px';
			accordionBtn2.setAttribute('aria-expanded', false);
			content2.setAttribute('aria-hidden', true);
		}
	});
}

accordions.forEach((item, index) => {
	const accordionBtn = item.querySelector('.accordion-button');
	accordionBtn.addEventListener('click', () => {
		item.classList.toggle('active');

		const content = item.querySelector('.accordion-content');
		if (item.classList.contains('active')) {
			content.style.maxHeight = `${content.scrollHeight}px`;
			accordionBtn.setAttribute('aria-expanded', true);
			content.setAttribute('aria-hidden', false);
		} else {
			content.style.maxHeight = '0px';
			accordionBtn.setAttribute('aria-expanded', false);
			content.setAttribute('aria-hidden', true);
		}
		removeOpen(index);
	});
});
