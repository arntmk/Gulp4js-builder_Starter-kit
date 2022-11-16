// Custom Scripts
//@include('index.js')

// Player
const play = document.querySelector('.about__play');
const video = document.querySelector('.about__video video');

play.addEventListener('click', () => {
	video.play();
	play.classList.add('about__play--hidden');
	video.setAttribute('controls', 'controls');
});
