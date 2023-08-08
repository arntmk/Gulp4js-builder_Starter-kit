/* ____________________________________________ */
// ===prevent page reload on submit===
const form = document.querySelectorAll('form');
if (form) {
	form.forEach((forms) => {
		forms.addEventListener('submit', (e) => {
			e.preventDefault();

			// Передача даних на сервер
			const formData = new FormData(form);
			fetch('https://www.google.com/form-api/form.php', { method: 'POST', body: formData });
		});
	});
}
