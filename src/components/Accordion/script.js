const accordions = document.querySelectorAll('details');

accordions.forEach((el) => {
	el.addEventListener('click', (e) => {
		const self = e.currentTarget;
		const content = self.querySelector('.content');

		self.classList.toggle('open');

		if (self.classList.contains('open')) {
			content.style.maxHeight = content.scrollHeight + 'px';
		} else {
			content.style.maxHeight = null;
		}
	});
});
