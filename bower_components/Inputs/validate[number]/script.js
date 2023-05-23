/* https://stackoverflow.com/questions/39362442/how-to-valid-numeric-values-onkeypress */
/* https://www.aspsnippets.com/Articles/Perform-Numeric-validation-Numbers-using-OnKeyPress-in-JavaScript.aspx */
/* https://stackoverflow.com/questions/17164239/add-delete-and-arrow-key-into-regular-expression */
/* https://www.youtube.com/shorts/nnZS761ngXE */

/* ____________________________________________ */
// ===Validate Numbers===

const ValidateNumbers = document.querySelector('[inputmode="numeric"]');

ValidateNumbers.onkeypress = function Validate(e) {
	const isNumber = /[0-9]/.test(String.fromCharCode(e.keyCode || e.which));
	return isNumber;
};
