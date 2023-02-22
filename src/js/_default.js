// ===Toggle Password Visibility===
const togglePassword = document?.querySelector('#togglePassword');
const password = document?.querySelector('#password');

togglePassword?.addEventListener('click', function (e) {
	// toggle the type attribute
	const type =
		password.getAttribute('type') === 'password' ? 'text' : 'password';
	password.setAttribute('type', type);
	// toggle the eye / eye slash icon
	this.classList.toggle('eye-close');
});

password?.addEventListener('input', function () {
	togglePassword.classList?.toggle('hidden', !this.value);
});

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

// ===Validate Numbers===
const numericInputs = document?.querySelectorAll('[inputmode="numeric"]');

numericInputs.forEach((input) => {
	validateInput(input);
});

function validateInput(el) {
	el.addEventListener('beforeinput', function (e) {
		let beforeValue = el.value;
		e.target.addEventListener(
			'input',
			function () {
				if (el.validity.patternMismatch) {
					el.value = beforeValue;
				}
			},
			{ once: true }
		);
	});
}

document.querySelector('[inputmode="numeric"]').onkeypress = function Validate(
	e
) {
	const isNumber = /[0-9.]/.test(String.fromCharCode(e.keyCode || e.which));
	return isNumber;
};
