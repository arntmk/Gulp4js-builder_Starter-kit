/* https://stackoverflow.com/questions/39362442/how-to-valid-numeric-values-onkeypress */
/* https://www.aspsnippets.com/Articles/Perform-Numeric-validation-Numbers-using-OnKeyPress-in-JavaScript.aspx */
/* https://stackoverflow.com/questions/17164239/add-delete-and-arrow-key-into-regular-expression */
/* https://www.youtube.com/shorts/nnZS761ngXE */

/* ____________________________________________ */
// ===Validate Numbers===

const numericInputs = document.querySelectorAll('[inputmode="numeric"]');

function validateInput(el) {
	el.addEventListener('beforeinput', (e) => {
		const beforeValue = el.value;
		e.target.addEventListener(
			'input',
			() => {
				if (el.validity.patternMismatch) {
					el.value = beforeValue;
				}
			},
			{ once: true },
		);
	});
}

numericInputs.forEach((input) => {
	validateInput(input);
});

/* ____________________________________________ */

document.querySelector('[inputmode="numeric"]').onkeypress = function Validate(e) {
	const isNumber = /[0-9.]/.test(String.fromCharCode(e.keyCode || e.which));
	return isNumber;
};
