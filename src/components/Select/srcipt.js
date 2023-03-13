/* ____________________________________________ */
// ===Select===

document.querySelectorAll('.select-wrapper').forEach((selects) => {
	const select = selects.querySelector('.select');
	const optionslist = selects.querySelector('.options-list');
	const options = selects.querySelectorAll('.option');

	if (select && optionslist && options) {
		// show & hide options list
		select.addEventListener('click', () => {
			select.classList.toggle('active');
			optionslist.classList.toggle('active');

			if (select.classList.contains('active')) {
				select.setAttribute('aria-expanded', true);
				optionslist.setAttribute('aria-hidden', false);
			} else {
				select.setAttribute('aria-expanded', false);
				optionslist.setAttribute('aria-hidden', true);
			}
		});

		// select option
		options.forEach((option) => {
			option.addEventListener('click', () => {
				options.forEach((optionl) => {
					optionl.classList.remove('selected');
				});

				select.querySelector('span').innerHTML = option.innerHTML;
				option.classList.add('selected');
				optionslist.classList.toggle('active');
			});
		});

		// Клик снаружи дропдауна. Закрыть дропдаун
		document.addEventListener('click', (e) => {
			if (e.target !== select) {
				select.classList.remove('active');
				optionslist.classList.remove('active');
				select.setAttribute('aria-expanded', false);
				optionslist.setAttribute('aria-hidden', true);
			}
		});

		// Нажатие на Tab или Escape. Закрыть дропдаун
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Tab' || e.key === 'Escape') {
				select.classList.remove('active');
				optionslist.classList.remove('active');
			}
		});
	}
});
