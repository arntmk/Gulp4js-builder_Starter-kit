/* ____________________________________________ */
// ===Validate Numbers===

const numericInputs = document.querySelectorAll('[inputmode="numeric"]');

if (numericInputs) {
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

	document.querySelector('[inputmode="numeric"]').onkeypress =
		function Validate(e) {
			const isNumber = /[0-9.]/.test(String.fromCharCode(e.keyCode || e.which));
			return isNumber;
		};
}
