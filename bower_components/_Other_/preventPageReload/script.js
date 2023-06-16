/* https://www.tutorialspoint.com/how-to-stop-refreshing-the-page-on-submit-in-javascript */
/* ____________________________________________ */
// ===prevent page reload on submit===
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
	e.preventDefault();
});
