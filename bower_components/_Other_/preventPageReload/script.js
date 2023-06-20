/* https://www.tutorialspoint.com/how-to-stop-refreshing-the-page-on-submit-in-javascript */
/* https://timetoprogram.com/prevent-page-reload-form-submit-react-js/ */
/* https://stackoverflow.com/questions/14589193/clearing-my-form-inputs-after-submission */

/* ____________________________________________ */
// ===prevent page reload on submit===
const form = document.querySelectorAll('form');
if (form) {
	form.forEach((forms) => {
		forms.addEventListener('submit', (e) => {
			e.preventDefault();
		});
	});
}

/* ____________________________________________ */
// ===prevent page to scroll up===
const link = document.querySelectorAll('a[href="#"]');
link.forEach((links) => {
	links.addEventListener('click', (e) => {
		e.preventDefault();
	});
});
