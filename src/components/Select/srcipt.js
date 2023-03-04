/* ____________________________________________ */
// ===Select===

const dropdown = document.querySelectorAll('.select-wrapper');
const select = document.querySelector('.select');
const options_list = document.querySelector('.options-list');
const options = document.querySelectorAll('.option');

if (select && options_list && options) {
	//show & hide options list
	select.addEventListener('click', () => {
		select.classList.toggle('active');
		options_list.classList.toggle('active');

		if (select.classList.contains('active')) {
			select.setAttribute('aria-expanded', true);
			options_list.setAttribute('aria-hidden', false);
		} else {
			select.setAttribute('aria-expanded', false);
			options_list.setAttribute('aria-hidden', true);
		}
	});

	//select option
	options.forEach((option) => {
		option.addEventListener('click', () => {
			options.forEach((option) => {
				option.classList.remove('selected');
				select.classList.remove('active');
				select.setAttribute('aria-expanded', false);
				options_list.setAttribute('aria-hidden', true);
			});

			select.querySelector('span').innerHTML = option.innerHTML;
			option.classList.add('selected');
			options_list.classList.toggle('active');
		});
	});
}
