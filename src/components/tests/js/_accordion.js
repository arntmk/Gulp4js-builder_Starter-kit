/* ____________________________________________ */
// ==AccordionNative==

const accordionsController = function () {
	const accordion = document.querySelectorAll('details');

	if (accordion) {
		// Animation
		accordion.forEach((summary) => {
			summary.addEventListener('click', (e) => {
				const self = e.currentTarget;
				const content = self.querySelector('.accordion-content');
				if (self.hasAttribute('open')) {
					content.style.maxHeight = '';
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

		// Клик на другой аркадион. Закрыть аркадион.
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
};
accordionsController();

// Animation | NEW
/* function setDetailsHeight(selector, wrapper = document) {
	const setHeight = (detail, open = false) => {
		detail.open = open;
		const rect = detail.getBoundingClientRect();
		detail.dataset.width = rect.width;
		detail.style.setProperty(open ? `--expanded` : `--collapsed`, `${rect.height}px`);
	};
	const details = wrapper.querySelectorAll(selector);
	const RO = new ResizeObserver((entries) => {
		return entries.forEach((entry) => {
			const detail = entry.target;
			const width = parseInt(detail.dataset.width, 10);
			if (width !== entry.contentRect.width) {
				detail.removeAttribute('style');
				setHeight(detail);
				setHeight(detail, true);
				detail.open = false;
			}
		});
	});
	details.forEach((detail) => {
		RO.observe(detail);
	});
}

// Run it
setDetailsHeight('details'); */
