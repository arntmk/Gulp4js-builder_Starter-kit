/* ____________________________________________ */
// ===Progress support JS / WebKit ===

for (const e of document.querySelectorAll('[type="range"]#range-progress')) {
	e.style.setProperty('--value', e.value);
	e.style.setProperty('--min', e.min === '' ? '0' : e.min);
	e.style.setProperty('--max', e.max === '' ? '100' : e.max);
	e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
