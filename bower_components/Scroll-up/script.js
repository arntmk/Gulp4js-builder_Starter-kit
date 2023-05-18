/* https://ru.stackoverflow.com/questions/1392091/%D0%9F%D0%B8%D1%81%D0%B0%D0%BB-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BD%D1%83%D1%8E-%D0%BF%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D1%83-%D0%B2%D0%B2%D0%B5%D1%80%D1%85-%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B-%D0%B8-%D1%81%D1%82%D0%BE%D0%BB%D0%BA%D0%BD%D1%83%D0%BB%D1%81%D1%8F-%D1%81-%D0%BE%D1%88%D0%B8%D0%B1%D0%BA%D0%BE%D0%B9-uncaught-typeerro */
/* https://www.youtube.com/watch?v=oqhJkybWffE&t=26s */
/* ____________________________________________ */
// ===Scroll to top===

const offset = 100;
const scrollUp = document.querySelector('.scroll-up');
const scrollUpSvgPath = document.querySelector('.scroll-up__svg-path');
const pathLength = scrollUpSvgPath.getTotalLength();

scrollUpSvgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
scrollUpSvgPath.style.transition = 'stroke-dashoffset 20ms';

const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

// updateDashoffset
const updateDashoffset = () => {
	const height = document.documentElement.scrollHeight - window.innerHeight;
	const dashoffset = pathLength - (getTop() * pathLength / height);

	scrollUpSvgPath.style.strokeDashoffset = dashoffset;
};

// onScroll
window.addEventListener('scroll', () => {
	updateDashoffset();

	if (getTop() > offset) {
		scrollUp.classList.add('scroll-up--active');
	} else {
		scrollUp.classList.remove('scroll-up--active');
	}
});

// Click
scrollUp.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
});
