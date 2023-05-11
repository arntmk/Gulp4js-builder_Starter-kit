// Load Gulp
const { src, dest, parallel, series, watch } = require('gulp'); // eslint-disable-line object-curly-newline

// Load plugins

const browsersync = require('browser-sync').create(); // Сервер.
const newer = require('gulp-newer'); // Перевірка файлів.
const changed = require('gulp-changed'); // Перевірка файлів.
const clean = require('gulp-clean'); // Видалення Build.
const gulpif = require('gulp-if'); // Режим dev or production.
const plumber = require('gulp-plumber'); // Пошук помилок.
const rename = require('gulp-rename'); // Rename.

const imagemin = require('gulp-imagemin'); // Оптимізація зображення.
const imageminPngquant = require('imagemin-pngquant'); // Оптимізація png only.
const imageminWebp = require('imagemin-webp'); // Конвертатор webp.

const fonter = require('gulp-fonter'); // Конвертатор шрифтів в woff.
const ttf2woff2 = require('gulp-ttf2woff2'); // Конвертатор в woff2.
const fontfacegen = require('gulp-fontfacegen'); // fontface gen.

const fileinclude = require('gulp-file-include'); // Модульність для html.
const htmlmin = require('gulp-htmlmin'); // Мінімізація html.
const typograf = require('gulp-typograf'); // Правопис.
const version = require('gulp-version-number'); // Build version.

const sass = require('gulp-sass')(require('sass')); // Препроцесор для css.
const autoprefixer = require('gulp-autoprefixer'); // Додавання префіксів для сумісності.
const groupCSSMedia = require('gulp-group-css-media-queries'); // Групування медіа-запитів.
const shorthand = require('gulp-shorthand'); // Shorthand css properties.
const cleanCSS = require('gulp-clean-css'); // Minimize-css, group-media, optimize.

const terser = require('gulp-terser'); // Мінімізація JS.
const babel = require('gulp-babel'); // Підтримка старих браузерів JS.
const concat = require('gulp-concat'); // Перейменування та об'єднання.
// const typescript = require('gulp-typescript'); //Конвертатор TypeScript в JS.

const svgmin = require('gulp-svgmin'); // Мінімізація svg.
const cheerio = require('gulp-cheerio'); // Видалення непотрібних атрибутів svg (Вбудовані стилі).
const replace = require('gulp-replace'); // Заміна символів після gulp-cheerio.
const svgSprite = require('gulp-svg-sprite'); // Об'єднання спрайтів.

/* ____________________________________________ */
// Редагування файлів без перезагрузки сервера
const { readFileSync } = require('fs');

const srcJs = JSON.parse(readFileSync('./src/js/modules.json'));
// const srcJs = require('./src/js/modules.json'); // eslint-disable-line global-require

/* ____________________________________________ */
// Production build

const isBuild = process.argv.includes('--production');
const isDev = !isBuild;

// Cleaner

function clear() {
	return src('build/*', { read: false })
		.pipe(gulpif(isBuild, clean()));
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
		{ read: false },
	).pipe(gulpif(isDev, clean()));
}

function delfont() {
	return src('src/scss/_font.{scss,sass}', {
		allowEmpty: true,
		read: false,
	}).pipe(clean());
}

/* ____________________________________________ */
// Fonts

function font() {
	const ttfTOwoff2 = 'src/assets/font/**/*.{ttf,woff2}';
	// const ttfTOwoff = 'src/assets/font/**/*.{ttf,woff}';
	const copySvgFont = 'src/assets/font/**/*.svg';
	return (src(ttfTOwoff2)
		.pipe(changed('build/font/', { extension: '.woff2' }))
		.pipe(ttf2woff2())
		.pipe(dest('build/font/'))
		.pipe(browsersync.stream())

	// .pipe(src(ttfTOwoff))
	// .pipe(changed('build/font/', { extension: '.woff' }))
	// .pipe(fonter({ formats: ['woff'] }))
	// .pipe(dest('build/font/'))
	// .pipe(browsersync.stream())

		.pipe(src(copySvgFont))
		.pipe(changed('build/font/', { extension: '.svg' }))
		.pipe(dest('build/font/'))
		.pipe(browsersync.stream())
	);
}

function fontgen() {
	// const tffTOtff = 'src/assets/font/**/*.ttf'; //Extra optimization /Test/
	const otfTOtff = 'src/assets/font/**/*.{otf,ttf}'; // eot,otf,ttf,otc,ttc
	const fontCss = 'src/assets/font/*.{otf,ttf,woff,woff2}';
	return src(otfTOtff)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(dest('src/assets/font/'))

		.pipe(src(fontCss))
		.pipe(fontfacegen({
			filepath: 'src/scss',
			filename: '_font.scss',
		}));
}

/* ____________________________________________ */
// Svg Sprite

function svg() {
	return src('src/assets/img/svg/*.svg')
		.pipe(plumber())
		.pipe(svgmin({ js2svg: { pretty: true } }))
		.pipe(cheerio({
			run($) {
				// $('[fill]').removeAttr('fill');
				// $('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
				$('[class]').removeAttr('class');
				$('[data-name]').removeAttr('data-name');
			},
			parserOptions: { xmlMode: true },
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: { stack: { sprite: '../svg-group.svg', example: true } },
		}))
		.pipe(dest('src/assets/img/svg/'));
}

/* ____________________________________________ */
// Optimize images

function webp() {
	return src('src/assets/img/*.{png,jpg,jpeg,webp}')
		.pipe(changed('build/img/', { extension: '.webp' }))
		.pipe(imagemin([imageminWebp({ quality: 100 })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(dest('build/img/'))
		.pipe(browsersync.stream());
}

function img() {
	const srcPng = 'src/assets/img/favicon/*.png';
	const srcSvg = 'src/assets/img/**/*.{gif,svg}'; // png,jpg,jpeg
	const copyImg = 'src/assets/img/favicon/*.{ico,webmanifest,json}';
	return src(srcSvg)
		.pipe(changed('build/img/'))
		.pipe(imagemin(
			[
				imagemin.gifsicle({ interlaced: true }),
				// imagemin.mozjpeg({ quality: 80, progressive: true }),
				// imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			],
			{
				verbose: true,
			},
		))
		.pipe(dest('build/img/'))
		.pipe(browsersync.stream())

		.pipe(src(copyImg))
		.pipe(changed('build/img/'))
		.pipe(dest('build/img/favicon/'))
		.pipe(browsersync.stream())

		.pipe(src(srcPng))
		.pipe(changed('build/img/favicon/', { extension: '.png' }))
		.pipe(imagemin([imageminPngquant({ quality: [0.8, 1.0] })]))
		.pipe(dest('build/img/favicon/'))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// Html

function html() {
	const copyIcoTxt = 'src/assets/*.{ico,txt}';
	return src('src/*.html')
		.pipe(plumber())
		.pipe(fileinclude({ prefix: '@' }))
		.pipe(typograf({
			locale: ['ru', 'en-US', 'uk'], // 'ukr', 'uk-UA'
			htmlEntity: { type: 'name' },
		}))
		.pipe(gulpif(isBuild, version({
			value: '%DT%',
			append: { key: '_v', cover: 0, to: ['css', 'js'] },
		})))
		.pipe(htmlmin({ removeComments: true, collapseWhitespace: isBuild }))
		.pipe(dest('build/'))
		.pipe(browsersync.stream())

		.pipe(src(copyIcoTxt))
		.pipe(changed('build/'))
		.pipe(dest('build/'))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// CSS

function css() {
	const copyLibsCss = 'src/scss/libs/*.css';
	return (src('src/scss/**/*.{scss,sass}', { sourcemaps: true })
		.pipe(gulpif(isDev, newer('build/css/style.min.css')))
		.pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(plumber())
		.pipe(shorthand())
		.pipe(gulpif(isBuild, groupCSSMedia()))
		.pipe(autoprefixer({ cascade: false, grid: true }))
		.pipe(gulpif(isBuild, dest('build/css/', { sourcemaps: isBuild })))
		.pipe(gulpif(isBuild, cleanCSS({ level: 2 })))
		.pipe(rename({ suffix: '.min', extname: '.css' }))
		.pipe(dest('build/css/', { sourcemaps: isDev }))
		.pipe(browsersync.stream())

		.pipe(src(copyLibsCss))
		.pipe(gulpif(isDev, changed('build/css/', { extension: '.css' })))
		.pipe(gulpif(isBuild, cleanCSS({ level: 2 })))
		.pipe(dest('build/css/'))
		.pipe(browsersync.stream())
	);
}

/* ____________________________________________ */
// JavaScript
// "./src/js/*.{js,jsx,ts,tsx,vue}"

function js() {
	const copyLibsJs = 'src/js/libs/*.js';
	return (src(srcJs, { sourcemaps: true })
		.pipe(plumber())
		.pipe(gulpif(isDev, newer('build/js/script.min.js')))
	// .pipe(typescript({ noImplicitAny: true, outFile: 'script.min.js' }))
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(gulpif(isBuild, concat('script.js')))
		.pipe(gulpif(isBuild, dest('build/js/', { sourcemaps: isBuild })))
		.pipe(concat('script.min.js'))
		.pipe(gulpif(isBuild, terser()))
		.pipe(dest('build/js/', { sourcemaps: isDev }))
		.pipe(browsersync.stream())

		.pipe(src(copyLibsJs))
		.pipe(gulpif(isDev, changed('build/js/', { extension: '.js' })))
		.pipe(gulpif(isBuild, terser()))
		.pipe(dest('build/js/'))
		.pipe(browsersync.stream())
	);
}

/* ____________________________________________ */
// Watch files

function watchFiles() {
	watch('src/scss/**/*.{scss,sass}', css);
	watch('src/**/*.html', html);
	watch('src/js/**/*.{js,jsx,ts,tsx,vue}', js);
	watch('src/assets/img/**/*.{png,ico,gif,svg,webmanifest,json}', img);
	watch('src/assets/img/**/*.{png,jpg,jpeg,webp}', webp);
	watch('src/assets/font/**/*.{otf,ttf,woff,woff2,svg}', font);
}

// BrowserSync
// browsersync.create().init({

function browserSync() {
	browsersync.init({
		server: { baseDir: 'build/' },
		notify: false,
		online: false,
		port: 3015,
		ui: false,
		logFileChanges: false,
		logConnections: false,
		browser: ['chrome'], // , 'firefox'
	});
}

/* ____________________________________________ */
exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clr, clear, font, parallel(html, css, js, img, webp));
exports.imgTsk = series(webp, img);
exports.fontTsk = font;
exports.fontgenTsk = series(delfont, fontgen);
exports.svgTsk = svg;
exports.clrTsk = clr;
