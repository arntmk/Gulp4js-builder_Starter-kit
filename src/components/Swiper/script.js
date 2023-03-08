'use strict';

/* ____________________________________________ */
// ===Swiper===

const swiper = new Swiper('.swiper-container', {
	// Optional parameters
	direction: 'horizontal', // vertical
	loop: true,
	spaceBetween: 20,
	slidesPerView: 3,
	slidesPerGroup: 1,
	//slideToClickedSlide: true,
	//centeredSlides: true,
	autoHeight: true,
	speed: 300,
	freeMode: true,

	autoplay: {
		delay: 5000,
	},

	breakpoints: {
		// when window width is >= 50px
		50: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		// when window width is >= 480px
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		// when window width is >= 640px
		640: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		paginationClickable: true,
		clickable: true,
	},

	// And if we need scrollbar
	// scrollbar: {
	//   el: '.swiper-scrollbar',
	// },
});
