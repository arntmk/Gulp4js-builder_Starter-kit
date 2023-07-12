/* function isMobile() {
	return navigator.maxTouchPoints > 0 && /Android|IPhone/i.test(navigator.userAgent);
	if (navigator.userAgent.indexOf('Firefox') === -1) {}
} */

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
	});
});
