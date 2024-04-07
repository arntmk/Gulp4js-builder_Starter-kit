/* ____________________________________________ */
// ==AccordionNative==

const accordionsController = function () {
	const accordion = document.querySelectorAll('details');

	if (accordion) {
		// Animation | OLD
		/* 		accordion.forEach((summary) => {
			summary.addEventListener('click', (e) => {
				const self = e.currentTarget;
				const content = self.querySelector('.accordion-content');
				if (self.hasAttribute('open')) {
					content.style.maxHeight = '';
				} else {
					content.style.maxHeight = `${content.scrollHeight}`;
				}
			});
		}); */

		/* ____________________________________________ */
		// https://linkedlist.ch/animate_details_element_60/
		// Animation | NEW
		document.querySelectorAll('summary').forEach((element) =>
			element.addEventListener('click', (event) => {
				const detailsElement = event.target.parentElement;
				const contentElement = event.target.nextElementSibling;

				if (contentElement.classList.contains('animation')) {
					contentElement.classList.remove('animation', 'collapsing');
					void element.offsetWidth;
					return;
				}

				const onAnimationEnd = (cb) => contentElement.addEventListener('animationend', cb, { once: true });

				requestAnimationFrame(() => contentElement.classList.add('animation'));
				onAnimationEnd(() => contentElement.classList.remove('animation'));

				const isDetailsOpen = detailsElement.getAttribute('open') !== null;
				if (isDetailsOpen) {
					event.preventDefault();
					contentElement.classList.add('collapsing');
					onAnimationEnd(() => {
						detailsElement.removeAttribute('open');
						contentElement.classList.remove('collapsing');
					});
				}
			}),
		);

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
