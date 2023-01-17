const { src, dest, parallel, series, watch } = require('gulp');

// Load plugins

const browsersync = require('browser-sync').create(); //Сервер.
const newer = require('gulp-newer'); //Перевірка файлів.
const changed = require('gulp-changed'); //Перевірка файлів.
const clean = require('gulp-clean'); //Видалення Build.
const gulpif = require('gulp-if'); //Режим dev or production.
const plumber = require('gulp-plumber'); //Пошук помилок.
const rename = require('gulp-rename'); //Rename.

const imagemin = require('gulp-imagemin'); //Оптимізація зображення.
const webp = require('gulp-webp'); //Конвертатор webp.

const fonter = require('gulp-fonter'); //Конвертатор шрифтів в woff.
const ttf2woff2 = require('gulp-ttf2woff2'); //Конвертатор в woff2.
const fontfacegen = require('gulp-fontfacegen'); //fontface gen.

const webpHTML = require('gulp-webp-html-fixed'); //Авто сумісність webp(html).
const fileinclude = require('gulp-file-include'); //Модульність для html.
const htmlmin = require('gulp-htmlmin'); //Мінімізація html.
const typograf = require('gulp-typograf'); //Правопис.
const vrnmbr = require('gulp-version-number'); //Build version.

const sass = require('gulp-sass')(require('sass')); //Препроцесор для css.
const autoprefixer = require('gulp-autoprefixer'); //Додавання префіксів для сумісності.
const webpCSS = require('gulp-webp-css-fixed'); // Авто сумісність webp(css).
const groupCSSMedia = require('gulp-group-css-media-queries'); //Групування медіа-запитів.
const shorthand = require('gulp-shorthand'); //Оптимізація коду.
const csso = require('gulp-csso'); //Мінімізація css.

const terser = require('gulp-terser'); //Мінімізація JS.
const babel = require('gulp-babel'); //Підтримка старих браузерів JS.
const concat = require('gulp-concat'); //Перейменування та об'єднання.
//const typeSpt = require('gulp-typescript'); //Конвертатор TypeScript.

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
	return src(
		[
			'build/css/*',
			'build/js/*',
			'build/*.*',
			'build/font/**/*.{otf,ttf}',
			'build/img/**/*.{webmanifest,json}',
		],
		{ read: false }
	).pipe(gulpif(isDev, clean()));
}

function delfont() {
	return src('src/scss/_font.{scss,sass}', {
		allowEmpty: true,
		read: false,
	}).pipe(clean());
}

// Optimize images

function img() {
	const srcWebp = 'src/img/**/*.{png,jpg,jpeg}';
	const srcImg = 'src/img/**/*.{png,jpg,jpeg,gif,svg}';
	const imgCopy = 'src/img/**/*.{ico,webp,webmanifest,json}';
	return src(srcWebp)
		.pipe(changed('build/img/'))
		.pipe(webp())
		.pipe(dest('build/img/'))
		.pipe(src(srcImg))
		.pipe(changed('build/img/'))
		.pipe(
			imagemin(
				[
					imagemin.gifsicle({ interlaced: true }),
					imagemin.mozjpeg({ quality: 80, progressive: true }),
					imagemin.optipng({ optimizationLevel: 5 }),
					// imagemin.pngquant({ quality: [0.8, 0.9] }),
					imagemin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
					}),
				],
				{
					verbose: true,
				}
			)
		)
		.pipe(dest('build/img/'))
		.pipe(src(imgCopy))
		.pipe(changed('build/img/'))
		.pipe(dest('build/img/'));
}

// Fonts

function font() {
	const ttfTOwoff = 'src/font/**/*.{ttf,woff}';
	const ttfTOwoff2 = 'src/font/**/*.{ttf,woff2}';
	const svgFontCopy = 'src/font/**/*.svg';
	return src(ttfTOwoff)
		.pipe(changed('build/font/', { extension: '.woff' }))
		.pipe(fonter({ formats: ['woff'] }))
		.pipe(dest('build/font/'))
		.pipe(src(ttfTOwoff2))
		.pipe(changed('build/font/', { extension: '.woff2' }))
		.pipe(ttf2woff2())
		.pipe(dest('build/font/'))
		.pipe(src(svgFontCopy))
		.pipe(changed('build/font/'))
		.pipe(dest('build/font/'));
}

function fontgen() {
	// const tffTOtff = 'src/font/**/*.ttf'; //Extra optimization /needs test/
	const otfTOtff = 'src/font/**/*.otf'; //eot,otf,ttf,otc,ttc
	const fontCss = 'src/font/*.*';
	return (
		src(otfTOtff)
			.pipe(changed('src/font/', { extension: '.ttf' }))
			.pipe(fonter({ formats: ['ttf'] }))
			.pipe(dest('src/font/'))
			.pipe(src(fontCss))
			// .pipe(newer('src/font/'))
			.pipe(
				fontfacegen({
					filepath: 'src/scss',
					filename: '_font.scss',
				})
			)
	);
}

// Svg Sprite

function svg() {
	const srcSvg = 'src/img/svg/*.svg';
	return src(srcSvg)
		.pipe(changed('build/img/svg/'))
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
	const copyIcoTxt = 'src/*.{ico,txt}';
	return src('src/*.html')
		.pipe(plumber())
		.pipe(gulpif(isDev, changed('build/html/pages/', { extension: '.html' })))
		.pipe(fileinclude({ prefix: '@@' }))
		.pipe(webpHTML())
		.pipe(typograf({ locale: ['ru', 'en-US'] }))
		.pipe(
			gulpif(
				isBuild,
				vrnmbr({
					value: '%DT%',
					append: { key: '_v', cover: 0, to: ['css', 'js'] },
				})
			)
		)
		.pipe(htmlmin({ removeComments: isBuild, collapseWhitespace: isBuild }))
		.pipe(dest('build/'))
		.pipe(browsersync.stream())
		.pipe(src(copyIcoTxt))
		.pipe(changed('build/'))
		.pipe(dest('build/'))
		.pipe(browsersync.stream());
}

// CSS

function css() {
	// const srcCss = 'src/scss/style.{scss,sass}';
	const srcCss = 'src/scss/**/*.{scss,sass}';
	const copyLibsCss = 'src/scss/libs/*.css';
	return src(srcCss, { sourcemaps: true })
		.pipe(gulpif(isDev, newer('build/css/style.min.css')))
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(plumber())
		.pipe(webpCSS())
		.pipe(csso())
		.pipe(shorthand())
		.pipe(gulpif(isBuild, groupCSSMedia()))
		.pipe(autoprefixer({ grid: true }))
		.pipe(gulpif(isBuild, dest('build/css/', { sourcemaps: isBuild })))
		.pipe(gulpif(isBuild, csso()))
		.pipe(rename('style.min.css'))
		.pipe(dest('build/css/', { sourcemaps: isDev }))
		.pipe(browsersync.stream())
		.pipe(src(copyLibsCss))
		.pipe(gulpif(isDev, changed('build/css/', { extension: '.css' })))
		.pipe(gulpif(isBuild, csso()))
		.pipe(dest('build/css/'))
		.pipe(browsersync.stream());
}

// JavaScript

function js() {
	// const srcJs = 'src/js/*.{js,jsx,ts,tsx,vue}';
	const srcJs = require('./src/js/modules.json');
	const copyLibsJs = 'src/js/libs/*.js';
	return (
		src(srcJs, { sourcemaps: true })
			.pipe(plumber())
			.pipe(gulpif(isDev, newer('build/js/script.min.js')))
			//.pipe(typeSpt({ noImplicitAny: true, outFile: 'script.min.js' }))
			.pipe(babel({ presets: ['@babel/preset-env'] }))
			.pipe(gulpif(isBuild, concat('script.js')))
			.pipe(gulpif(isBuild, dest('build/js/', { sourcemaps: isBuild })))
			.pipe(gulpif(isBuild, terser()))
			.pipe(concat('script.min.js'))
			.pipe(dest('build/js/', { sourcemaps: isDev }))
			.pipe(browsersync.stream())
			.pipe(src(copyLibsJs))
			.pipe(gulpif(isDev, changed('build/js/', { extension: '.js' })))
			.pipe(gulpif(isBuild, terser()))
			.pipe(dest('build/js/'))
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
exports.default = series(clear, font, parallel(html, css, js, img));
exports.img = img;
exports.font = font;
exports.fontgen = series(delfont, fontgen);
exports.svg = svg;
exports.clr = clr;
