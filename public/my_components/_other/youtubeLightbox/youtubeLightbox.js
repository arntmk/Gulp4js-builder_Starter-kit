// ! Селектор для ссылок - на которых нужно вызывать youtubeLightbox
const linksBtnsSelector = 'a[data-youtubeLightbox]';
// const linksBtnsSelector = '.lightbox';

// load Youtube API code asynchronously
const tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) != null; // boolean check for iOS devices

const youtubelightbox = document.getElementById('youtubelightbox');
let player; // variable to hold new YT.Player() instance

// Hide lightbox when clicked on
youtubelightbox.addEventListener(
	'click',
	function () {
		this.style.display = 'none';
		player.stopVideo();
	},
	false,
);

// Exclude youtube iframe from above action
youtubelightbox.querySelector('.youtubelightbox__centeredchild').addEventListener(
	'click',
	(e) => {
		e.stopPropagation();
	},
	false,
);

// define onYouTubeIframeAPIReady() function and initialize lightbox when API is ready
function onYouTubeIframeAPIReady() {
	createlightbox();
}

// Extracts the Youtube video ID from a well formed Youtube URL
function getyoutubeid(link) {
	// Assumed Youtube URL formats
	// https://www.youtube.com/watch?v=Pe0jFDPHkzo
	// https://youtu.be/Pe0jFDPHkzo
	// https://www.youtube.com/v/Pe0jFDPHkzo
	// and more

	// See http://stackoverflow.com/a/6904504/4360074
	const youtubeidreg =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
	return youtubeidreg.exec(link)[1]; // return Youtube video ID portion of link
}

// Creates a new YT.Player() instance
function createyoutubeplayer(videourl) {
	player = new YT.Player('youtubelightboxPlayer', {
		videoId: videourl,
		playerVars: { autoplay: 1 },
	});
}

// Main Youtube lightbox function
function createlightbox() {
	const targetlinks = document.querySelectorAll(linksBtnsSelector);

	for (let i = 0; i < targetlinks.length; i++) {
		const link = targetlinks[i];
		link._videoid = getyoutubeid(link); // store youtube video ID portion of link inside _videoid property
		targetlinks[i].addEventListener(
			'click',
			function (e) {
				youtubelightbox.style.display = 'block';
				if (typeof player === 'undefined') {
					// if video player hasn't been created yet
					createyoutubeplayer(this._videoid);
				} else if (isiOS) {
					// iOS devices can only use the "cue" related methods
					player.cueVideoById(this._videoid);
				} else {
					player.loadVideoById(this._videoid);
				}
				e.preventDefault();
			},
			false,
		);
	}
}
