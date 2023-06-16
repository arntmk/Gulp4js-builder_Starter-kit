/* https://www.tutorialspoint.com/how-to-stop-refreshing-the-page-on-submit-in-javascript */

/* ____________________________________________ */
// ===prevent page reload on submit===
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
	e.preventDefault();
});

/* ____________________________________________ */
// ===prevent page reload on submit===
/* const form = document.querySelector('form');
const submit = document.querySelector('.submit');
function submitForm(e) {
	e.preventDefault();
	form.style.display = 'none';
	submit.innerHTML = '<b>Form submit successful</b>';
}
form.addEventListener('submit', submitForm); */
