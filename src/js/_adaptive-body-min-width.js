// ===Adaptive-body-min-width===
function adaptiveSizePageScaleInit(definedStartWidth) {
	const page = document.documentElement;
	let { clientWidth } = page;
	let pageComputedWidth;
	let resizeCoef;
	let resizeCoefPercents;
	let startWidth = definedStartWidth;
	if (!(startWidth / 1)) {
		const bodyMinWidthStr = getComputedStyle(document.body).minWidth;
		const bodyMinWidthNumber = Number(bodyMinWidthStr.replace(/[^0-9]/g, ''));
		startWidth = bodyMinWidthNumber;
	}
	function scalePage(startWidthh) {
		clientWidth = page.clientWidth;
		if (startWidthh / 1 && clientWidth <= startWidthh) {
			pageComputedWidth = parseInt(getComputedStyle(page).width, 10);
			resizeCoef = clientWidth / pageComputedWidth;
			resizeCoefPercents = 100 * resizeCoef;
			page.style.transformOrigin = 'top left';
			page.style.transform = `scale(${resizeCoef})`;
			page.style.width = `${resizeCoefPercents}%`;
			page.style.height = `${resizeCoefPercents}%`;
		} else {
			page.style.transform = '';
			page.style.transformOrigin = '';
			page.style.width = '';
			page.style.height = '';
		}
	}
	window.addEventListener('resize', () => {
		scalePage(startWidth);
	});
	scalePage(startWidth);
}
function startOnSpecificBrowserInit() {
	const userAgent = window.navigator.userAgent.toLowerCase();
	let browser;
	switch (true) {
	case userAgent.indexOf('edge') > -1:
		browser = 'msEdge';
		break;
	case userAgent.indexOf('edg/') > -1:
		browser = 'chrEdge';
		break;
	case userAgent.indexOf('opr') > -1 && !!window.opr:
		browser = 'opera';
		break;
	case userAgent.indexOf('chrome') > -1 && !!window.chrome:
		browser = 'chrome';
		break;
	case userAgent.indexOf('trident') > -1:
		browser = 'ie';
		break;
	case userAgent.indexOf('firefox') > -1:
		browser = 'firefox';
		break;
	case userAgent.indexOf('safari') > -1:
		browser = 'safari';
		break;
	default:
		browser = 'other';
	}
	if (browser === 'safari' || browser === 'firefox') {
		adaptiveSizePageScaleInit();
	}
}

startOnSpecificBrowserInit();
