const tabsController = function () {
	const tabsNav = document.querySelectorAll('.tabs__nav-btn');
	const tabsContent = document.querySelectorAll('.tabs__content');
	const tabsNavClick = document.querySelector('.tabs__nav-btn');

	if (tabsNav && tabsContent && tabsNavClick) {
		tabsNav.forEach((item) =>
			item.addEventListener('click', () => {
				const currentBtn = item;
				const tabId = currentBtn.getAttribute('data-tab');
				const currentTab = document.querySelector(tabId);

				if (!currentBtn.classList.contains('active')) {
					tabsNav.forEach((child) => {
						child.classList.remove('active');
						child.setAttribute('aria-expanded', false);
					});

					tabsContent.forEach((child) => {
						child.classList.remove('active');
						child.setAttribute('aria-hidden', true);
					});

					currentBtn.classList.add('active');
					currentTab.classList.add('active');
					currentBtn.setAttribute('aria-expanded', true);
					currentTab.setAttribute('aria-hidden', false);
				}
			}),
		);
		tabsNavClick.click();
	}
};
tabsController();
