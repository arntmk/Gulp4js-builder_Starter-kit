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
//const fonter = require('gulp-fonter'); //Конвертатор шрифтів в woff.
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
	const ClrCss = 'build/css/*';
	const ClrJS = 'build/js/*';
	const ClrHtml = 'build/*.*';
	const ClrFonts = 'build/fonts/*.ttf';
	const ClrImg = 'build/img/**/*.{ico,gif,svg,webmanifest,json}';
	return src(ClrCss, { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(ClrJS), { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(ClrHtml), { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(ClrFonts), { read: false })
		.pipe(gulpif(isDev, clean()))
		.pipe(src(ClrImg), { read: false })
		.pipe(gulpif(isDev, clean()));
}

// CSS

function css() {
	// const SrcCss = 'src/scss/**/*.{scss,sass}';
	const SrcCss = 'src/scss/style.{scss,sass}';
	return src(SrcCss, { sourcemaps: isDev })
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

// Optimize images

function img() {
	const SrcImg = 'src/img/**/*.{png,jpg,jpeg,ico,gif,webp,webmanifest,json}';
	const SvgCopy = 'src/img/**/*.svg';
	return src(SrcImg)
		.pipe(newer('build/img/'))
		.pipe(webp())
		.pipe(dest('build/img/'))
		.pipe(src(SrcImg))
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
		.pipe(src(SvgCopy))
		.pipe(dest('build/img/'))
		.pipe(browsersync.stream());
}

// Fonts

function font() {
	const SrcFont = 'src/fonts/**/*.{otf,ttf,woff,woff2}'; //eot,otf,ttf,otc,ttc
	return (
		src(SrcFont)
			// .pipe(newer('src/fonts/'))
			// .pipe(fonter({ formats: ['ttf'] }))
			// .pipe(dest('src/fonts/'))
			// .pipe(newer('src/fonts/'))
			// .pipe(fonter({ formats: ['woff'] }))
			// .pipe(dest('src/fonts/'))
			.pipe(gulpif(isDev, newer('build/fonts/')))
			.pipe(gulpif(isDev, dest('build/fonts/')))
			.pipe(newer('build/fonts/'))
			.pipe(ttf2woff2())
			.pipe(dest('build/fonts/'))
	);
}

// Svg Sprite

function svg() {
	const SrcSvg = 'src/img/svg/*.svg';
	return src(SrcSvg)
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
		.pipe(gulpif(isDev, newer('build/index.html')))
		.pipe(plumber())
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

// JavaScript

function js() {
	// const SrcJs = 'src/js/**/*.{js,jsx,ts,tsx,vue}';
	const SrcJs = require('./src/js/modules.json');
	return (
		src(SrcJs, { sourcemaps: isDev })
			.pipe(gulpif(isDev, newer('build/js/script.min.js')))
			.pipe(plumber())
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
	watch('src/fonts/**/*.{otf,ttf,woff,woff2,svg}', font);
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
exports.svg = svg;
exports.font = font;
exports.clr = clr;
