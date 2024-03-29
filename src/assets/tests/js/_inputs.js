/* ____________________________________________ */
// ===Toggle Password Visibility===

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('[type="password"]');

if (togglePassword && password) {
	togglePassword.addEventListener('click', function () {
		// toggle the type attribute
		const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
		password.setAttribute('type', type);
		// toggle the eye / eye slash icon
		this.classList.toggle('eye-close');
	});

	password.addEventListener('input', function () {
		togglePassword.classList.toggle('hidden', !this.value);
	});
}

/* ____________________________________________ */
// ===Toggle search cleaning===

const searchInput = document.querySelector('[type="search"]');
const clearButton = document.querySelector('#deltxtinput');

if (searchInput && clearButton) {
	clearButton.addEventListener('click', () => {
		searchInput.value = '';
		searchInput.dispatchEvent(new Event('input'));
	});

	searchInput.addEventListener('input', function () {
		clearButton.classList.toggle('hidden', !this.value);
	});
}

/* ____________________________________________ */
// ===Validate Numbers===

document.querySelectorAll('.input-number').forEach((numbers) => {
	const ValidateNumbers = numbers.querySelector('[type="number"]');
	ValidateNumbers.onkeypress = function Validate(e) {
		const isNumber = /[0-9.-]/.test(String.fromCharCode(e.keyCode || e.which));
		return isNumber;
	};
});

/* ____________________________________________ */
// ===Progress support JS / WebKit===

for (const e of document.querySelectorAll('[type="range"]#range-progress')) {
	e.style.setProperty('--value', e.value);
	e.style.setProperty('--min', e.min === '' ? '0' : e.min);
	e.style.setProperty('--max', e.max === '' ? '100' : e.max);
	e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
