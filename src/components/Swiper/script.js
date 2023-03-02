const swiper = new Swiper('.swiper', {
	// Optional parameters
	// direction: 'vertical',
	loop: true,
	spaceBetween: 20,
	slidesPerView: 2,
	autoHeight: true,

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// If we need pagination
	// pagination: {
	// 	el: '.swiper-pagination',
	// 	clickable: true,
	// },

	// And if we need scrollbar
	// scrollbar: {
	//   el: '.swiper-scrollbar',
	// },
});
