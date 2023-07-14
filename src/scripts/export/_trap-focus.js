/* ____________________________________________ */
// https://codepen.io/vaskort/pen/LYpwjoj
// https://hidde.blog/using-javascript-to-trap-focus-in-an-element/
/* ____________________________________________ */
// ===trapFocus===
const trapFocus = (element) => {
	const focusableEls = Array.from(
		element.querySelectorAll(
			'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="0"]), audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])',
		),
	);
	const firstFocusableEl = focusableEls[0];

	firstFocusableEl.focus();
};

export default trapFocus;
