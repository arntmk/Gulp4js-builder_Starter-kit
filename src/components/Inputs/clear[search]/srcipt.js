'use strict';
/* ____________________________________________ */
// ===Toggle search cleaning===

const searchInput = document.querySelector('input[type="search"]');
const clearButton = document.querySelector('#deltxtinput');

if (searchInput && clearButton) {
	clearButton.addEventListener('click', function () {
		searchInput.value = '';
		searchInput.dispatchEvent(new Event('input'));
	});

	searchInput.addEventListener('input', function () {
		clearButton.classList.toggle('hidden', !this.value);
	});
}
