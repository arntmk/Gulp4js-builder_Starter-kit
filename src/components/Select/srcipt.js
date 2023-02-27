/* ____________________________________________ */
// ===Select===

const select = document.querySelector('.select');
const options_list = document.querySelector('.options-list');
const options = document.querySelectorAll('.option');

//show & hide options list
select.addEventListener('click', () => {
	select.classList.toggle('active');
	options_list.classList.toggle('active');
	// select.querySelector('.fa-angle-down').classList.toggle('fa-angle-up');
});

//select option
options.forEach((option) => {
	option.addEventListener('click', () => {
		options.forEach((option) => {
			option.classList.remove('selected');
		});
		select.querySelector('span').innerHTML = option.innerHTML;
		option.classList.add('selected');
		options_list.classList.toggle('active');
		// select.querySelector('.fa-angle-down').classList.toggle('fa-angle-up');
	});
});
