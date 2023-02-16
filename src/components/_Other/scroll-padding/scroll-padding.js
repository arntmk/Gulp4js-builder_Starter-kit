const navigationHeight = document.querySelector('.header').offsetHeight;

document.documentElement.style.setProperty(
	'--scroll-padding',
	navigationHeight - 1 + 'px'
);
