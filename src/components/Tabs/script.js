/* ____________________________________________ */
// ===Tabs===

const tabsNav = document.querySelectorAll('.tabs__trigger');
const tabsContent = document.querySelectorAll('.tabs__content');

if (tabsNav && tabsContent) {
	tabsNav.forEach((item) =>
		item.addEventListener('click', function (e) {
			e.preventDefault();
			const id = e.target.getAttribute('href').replace('#', '');

			tabsNav.forEach((child) =>
				child.classList.remove('tabs__trigger--active')
			);
			tabsContent.forEach((child) =>
				child.classList.remove('tabs__content--active')
			);

			item.classList.add('tabs__trigger--active');
			document.getElementById(id).classList.add('tabs__content--active');
		})
	);
	document.querySelector('.tabs__trigger').click();
}
