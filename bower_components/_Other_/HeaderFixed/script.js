/* ____________________________________________ */
// ===Header Fixed===

const navigationHeight = document.querySelector('.header').offsetHeight;

document.documentElement.style.setProperty('--scroll-padding', `${navigationHeight - 1}px`);

/* ____________________________________________ */
/* ____________________________________________ */
/* ____________________________________________ */
// ===Header Change Color===

/* const header = document.querySelector('.header');
const minOffset = 50;
window.onscroll = () => {
	header.classList.toggle('nav-scrolled', minOffset < document.documentElement.scrollTop);
}; */

/* ____________________________________________ */
/* ____________________________________________ */
/* ____________________________________________ */
// ===Header Change Color===
const header = document.querySelector('.header');
const navTopSection = document.querySelector('.nav-observer');

const navOptions = {
	rootMargin: '-200px 0px 0px 0px',
};

const onScroll = (entries, observer) => {
	entries.forEach((entry) => {
		header.classList.toggle('nav-scrolled', !entry.isIntersecting);
	});
};

const navObserver = new IntersectionObserver(onScroll, navOptions);

navObserver.observe(navTopSection);
