/* ____________________________________________ */
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

/* ____________________________________________ */
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

/* ____________________________________________ */
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

/* ____________________________________________ */
// ==Accordion==

const accordion = document.querySelectorAll('details');

accordion.forEach((el) => {
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

accordion.forEach((targetDetail) => {
	targetDetail.addEventListener('click', () => {
		accordion.forEach((detail) => {
			if (detail !== targetDetail) {
				detail.removeAttribute('open');
				detail.classList.remove('open');
			}
		});
	});
});

/* ____________________________________________ */
// ===Progress support JS / WebKit===

for (let e of document.querySelectorAll(
	'input[type="range"]#webkit-progress'
)) {
	e.style.setProperty('--value', e.value);
	e.style.setProperty('--min', e.min == '' ? '0' : e.min);
	e.style.setProperty('--max', e.max == '' ? '100' : e.max);
	e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
