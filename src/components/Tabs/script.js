'use strict';

/* ____________________________________________ */
// ===Tabs===

const tabsNav = document.querySelectorAll('.tabs__trigger');
const tabsContent = document.querySelectorAll('.tabs__content');

if (tabsNav && tabsContent) {
	tabsNav.forEach((item) =>
		item.addEventListener('click', function (e) {
			e.preventDefault();
			const id = e.target.getAttribute('href').replace('#', '');

			tabsNav.forEach((child) => child.classList.remove('active'));
			tabsContent.forEach((child) => child.classList.remove('active'));

			item.classList.add('active');
			document.getElementById(id).classList.add('active');
		})
	);
	document.querySelector('.tabs__trigger').click();
}
