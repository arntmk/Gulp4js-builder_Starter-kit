// ===Toggle search cleaning===
const searchInput = document?.querySelector('#txtsearchinput');
const clearButton = document?.querySelector('#deltxtinput');

clearButton?.addEventListener('click', function () {
	searchInput.value = '';
	searchInput.dispatchEvent(new Event('input'));
});

searchInput?.addEventListener('input', function () {
	clearButton.classList?.toggle('hidden', !this.value);
});
