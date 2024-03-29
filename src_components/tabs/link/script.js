/* ____________________________________________ */
// ===Tabs===

const tabsController = function () {
	const tabsNav = document.querySelectorAll('.tabs__nav-btn');
	const tabsContent = document.querySelectorAll('.tabs__content');
	const tabsNavClick = document.querySelector('.tabs__nav-btn');

	if (tabsNav && tabsContent && tabsNavClick) {
		tabsNav.forEach((item) =>
			item.addEventListener('click', (e) => {
				e.preventDefault();
				const id = e.target.getAttribute('href').replace('#', '');

				tabsNav.forEach((child) => {
					child.classList.remove('active');
					child.setAttribute('aria-expanded', false);
				});
				tabsContent.forEach((child) => {
					child.classList.remove('active');
					child.setAttribute('aria-hidden', true);
				});

				item.classList.add('active');
				document.getElementById(id).classList.add('active');
				item.setAttribute('aria-expanded', true);
				document.getElementById(id).setAttribute('aria-hidden', false);
			}),
		);
		tabsNavClick.click();
	}
};
tabsController();
