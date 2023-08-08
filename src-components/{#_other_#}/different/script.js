/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
	if (navigator.userAgent.indexOf('Firefox') === -1) {}
} */

/* ____________________________________________ */
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
// ===prevent page to scroll up on link===
const link = document.querySelectorAll('a[href*="#"]');
link.forEach((links) => {
	links.addEventListener('click', (e) => {
		e.preventDefault();

		// Передача даних на сервер
		const formData = new FormData(form);
		fetch('https://www.google.com/form-api/form.php', { method: 'POST', body: formData });
	});
});

/* ____________________________________________ */
// worse
window.addEventListener('load', () => {
	log.textContent += 'load\n';
});

/* ____________________________________________ */
// better
document.addEventListener('DOMContentLoaded', () => {
	log.textContent += 'DOMContentLoaded\n';
});
