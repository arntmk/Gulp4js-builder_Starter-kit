/* ____________________________________________ */
// ===Swiper===

const sliders = document.querySelectorAll('.swiper-container');

sliders.forEach((el) => {
	const swiper = new Swiper(el, {
		// Optional parameters
		direction: 'horizontal', // vertical
		loop: true,
		spaceBetween: 20,
		slidesPerView: 1,
		slidesPerGroup: 1,
		// slideToClickedSlide: true,
		// centeredSlides: true,
		autoHeight: true,
		speed: 300,
		freeMode: true,
		// effect: fade,

		autoplay: {
			delay: 4000,
		},

		breakpoints: {
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
			nextEl: el.querySelector('.swiper-button-next'),
			prevEl: el.querySelector('.swiper-button-prev'),
		},

		// If we need pagination
		pagination: {
			el: el.querySelector('.swiper-pagination'),
			type: 'bullets', // fraction
			paginationClickable: true,
			clickable: true,
		},

		// And if we need scrollbar
		// scrollbar: {
		// 	el: el.querySelector('.swiper-scrollbar'),
		// },
	});
});
