const { src, dest, parallel, series, watch } = require('gulp');

// Load plugins

const sass = require('gulp-sass')(require('sass')); //Препроцесор для css.
const autoprefixer = require('gulp-autoprefixer'); //Додавання префіксів для сумісності.
const concat = require('gulp-concat'); //Перейменування та об'єднання.
const fileinclude = require('gulp-file-include'); //Модульність для html.
const htmlmin = require('gulp-htmlmin'); //Мінімізація html.
const browsersync = require('browser-sync').create(); //Сервер.
const imagemin = require('gulp-imagemin'); //Оптимізація зображення.
const clean = require('gulp-clean'); //Видалення Build.
const webp = require('gulp-webp'); //Конвертатор webp.
const webpHTML = require('gulp-webp-html-fixed'); //Авто сумісність webp(html).
const webpCSS = require('gulp-webp-css-fixed'); // Авто сумісність webp(css).
const newer = require('gulp-newer'); //Перевірка файлів.
const terser = require('gulp-terser'); //Мінімізація JS.
const plumber = require('gulp-plumber'); //Пошук помилок.
const fonter = require('gulp-fonter'); //Конвертатор шрифтів в woff.
const ttf2woff2 = require('gulp-ttf2woff2'); //Конвертатор в woff2.
const gulpif = require('gulp-if'); //Режим dev or production.
const babel = require('gulp-babel'); //Підтримка старих браузерів JS.
const typograf = require('gulp-typograf'); //Правопис.
//const typeSpt = require('gulp-typescript'); //Конвертатор TypeScript.
const vn = require('gulp-version-number'); //Build version.
const groupCSSMedia = require('gulp-group-css-media-queries'); //Групування медіа-запитів.
const shorthand = require('gulp-shorthand'); //Оптимізація коду.
const csso = require('gulp-csso'); //Мінімізація css.
const svgmin = require('gulp-svgmin'); //Мінімізація svg.
const cheerio = require('gulp-cheerio'); //Видалення непотрібних атрибутів svg (Вбудовані стилі).
const replace = require('gulp-replace'); //Заміна символів після gulp-cheerio.
const svgSprite = require('gulp-svg-sprite'); //Об'єднання спрайтів.

// Pproduction build

const isBuild = process.argv.includes('--production');
const isDev = !isBuild;

// Cleaner

function clear() {
	return src('build/*', { read: false }).pipe(gulpif(isBuild, clean()));
}
function clr() {
	const clrCss = 'build/css/*';
	const clrJs = 'build/js/*';
	const clrHtml = 'build/*.*';
	const clrFont = 'build/font/*.{otf,svg}';
	const clrImg = 'build/img/**/*.{ico,gif,svg,webmanifest,json}';
	return src(clrCss, { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(clrJs), { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(clrHtml), { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(clrFont), { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(clrImg), { read: false })
		.pipe(gulpif(isDev, clean()));
}

// Optimize images

function img() {
	const srcImg = 'src/img/**/*.{png,jpg,jpeg,ico,gif,webp}';
	const srcCopy = 'src/img/**/*.{svg,webmanifest,json}';
	return src(srcImg)
		.pipe(newer('build/img/'))
		.pipe(webp())
		.pipe(dest('build/img/'))
		.pipe(src(srcImg))
		.pipe(newer('build/img/'))
		.pipe(
			imagemin({
				progressive: true,
				plugins: [{ removeViewBox: true }],
				interlaced: true,
				optimizationLevel: 3, //0 to 7
			})
		)
		.pipe(dest('build/img/'))
		.pipe(src(srcCopy))
		.pipe(newer('build/img/'))
		.pipe(dest('build/img/'))
		.pipe(browsersync.stream());
}

// Fonts

function font() {
	const ttfTOwoff2 = 'src/font/**/*.{ttf,woff2}';
	const svgFontCopy = 'src/font/**/*.svg';
	return src(ttfTOwoff2)
		.pipe(gulpif(isDev, newer('build/font/')))
		.pipe(gulpif(isDev, dest('build/font/')))
		.pipe(src(ttfTOwoff2))
		.pipe(newer('build/font/'))
		.pipe(ttf2woff2())
		.pipe(dest('build/font/'))
		.pipe(src(svgFontCopy))
		.pipe(newer('build/font/'))
		.pipe(dest('build/font/'));
}

function oldfont() {
	const otfTOtff = 'src/font/**/*.otf'; //eot,otf,ttf,otc,ttc
	const ttfTOwoff = 'src/font/**/*.{ttf,woff}';
	return src(otfTOtff)
		.pipe(newer('src/font/'))
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(dest('src/font/'))
		.pipe(src(ttfTOwoff))
		.pipe(newer('build/font/'))
		.pipe(fonter({ formats: ['woff'] }))
		.pipe(dest('build/font/'));
}

// Svg Sprite

function svg() {
	const srcSvg = 'src/img/svg/*.svg';
	return src(srcSvg)
		.pipe(newer('build/img/svg/'))
		.pipe(svgmin({ js2svg: { pretty: true } }))
		.pipe(
			cheerio({
				run: function ($) {
					$('file').removeAttr('file');
					$('stroke').removeAttr('stroke');
					$('style').removeAttr('style');
				},
				parserOptions: { xmlMode: true },
			})
		)
		.pipe(replace('&gt;', '>'))
		.pipe(
			svgSprite({
				mode: { symbol: { sprite: 'sprite.svg', example: true } },
			})
		)
		.pipe(dest('build/img/svg/'));
}

// Html

function html() {
	return src('src/*.html')
		.pipe(plumber())
		.pipe(gulpif(isDev, newer('build/index.html')))
		.pipe(fileinclude({ prefix: '@@' }))
		.pipe(webpHTML())
		.pipe(typograf({ locale: ['ru', 'en-US'] }))
		.pipe(
			gulpif(
				isBuild,
				vn({
					value: '%DT%',
					append: { key: '_v', cover: 0, to: ['css', 'js'] },
				})
			)
		)
		.pipe(htmlmin({ removeComments: isBuild, collapseWhitespace: isBuild }))
		.pipe(dest('build/'))
		.pipe(browsersync.stream());
}

// CSS

function css() {
	// const srcCss = 'src/scss/**/*.{scss,sass}';
	const srcCss = 'src/scss/style.{scss,sass}';
	return src(srcCss, { sourcemaps: isDev })
		.pipe(gulpif(isDev, newer('build/css/style.min.css')))
		.pipe(plumber())
		.pipe(sass())
		.pipe(webpCSS())
		.pipe(autoprefixer({ grid: true }))
		.pipe(shorthand())
		.pipe(groupCSSMedia())
		.pipe(gulpif(isBuild, dest('build/css/')))
		.pipe(gulpif(isBuild, csso()))
		.pipe(concat('style.min.css'))
		.pipe(dest('build/css/', { sourcemaps: isDev }))
		.pipe(browsersync.stream());
}

// JavaScript

function js() {
	// const srcJs = 'src/js/**/*.{js,jsx,ts,tsx,vue}';
	const srcJs = require('./src/js/modules.json');
	return (
		src(srcJs, { sourcemaps: isDev })
			.pipe(plumber())
			.pipe(gulpif(isDev, newer('build/js/script.min.js')))
			//.pipe(typeSpt({ noImplicitAny: true, outFile: 'script.min.js' }))
			.pipe(babel({ presets: ['@babel/preset-env'] }))
			.pipe(gulpif(isBuild, concat('script.js')))
			.pipe(gulpif(isBuild, dest('build/js')))
			.pipe(gulpif(isBuild, terser()))
			.pipe(concat('script.min.js'))
			.pipe(dest('build/js', { sourcemaps: isDev }))
			.pipe(browsersync.stream())
	);
}

// Watch files

function watchFiles() {
	watch('src/scss/**/*.{scss,sass}', css);
	watch('src/**/*.html', html);
	watch('src/js/**/*.{js,jsx,ts,tsx,vue}', js);
	watch('src/img/**/*.{png,jpg,jpeg,ico,gif,svg,webp,webmanifest,json}', img);
	watch('src/font/**/*.{otf,ttf,woff,woff2,svg}', font);
}

// BrowserSync

function browserSync() {
	browsersync.init({
		server: { baseDir: 'build/' },
		notify: false,
		online: true,
		port: 3015,
	});
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, clr, font, parallel(html, css, js, img));
exports.img = img;
exports.font = font;
exports.oldfont = oldfont;
exports.svg = svg;
exports.clr = clr;
