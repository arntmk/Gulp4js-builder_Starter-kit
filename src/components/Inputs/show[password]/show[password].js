// ===Toggle Password Visibility===

const togglePassword = document.querySelector('#togglePassword');
// const password = document.querySelector('#password');

togglePassword.addEventListener('click', function (e) {
	// toggle the type attribute
	const type =
		password.getAttribute('type') === 'password' ? 'text' : 'password';
	password.setAttribute('type', type);
	// toggle the eye / eye slash icon
	this.classList.toggle('eye-close');
});

password.addEventListener('input', function () {
	togglePassword.classList.toggle('hidden', !this.value);
});

// prevent form submit
// const form = document.querySelector('form');
// form.addEventListener('submit', function (e) {
//   e.preventDefault();
// });
