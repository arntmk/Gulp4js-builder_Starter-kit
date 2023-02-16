// Custom Scripts imports

// Toggle Password Visibility
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', function (e) {
	const type =
		password.getAttribute('type') === 'password' ? 'text' : 'password';
	password.setAttribute('type', type);
	this.classList.toggle('eye-close');
});

password.addEventListener('input', function () {
	togglePassword.classList.toggle('hidden', !this.value);
});

// Toggle search cleaning
const searchInput = document.querySelector('#txtsearchinput');
const clearButton = document.querySelector('#deltxtinput');

clearButton.addEventListener('click', function () {
	searchInput.value = '';
	searchInput.dispatchEvent(new Event('input'));
});

searchInput.addEventListener('input', function () {
	clearButton.classList.toggle('hidden', !this.value);
});
