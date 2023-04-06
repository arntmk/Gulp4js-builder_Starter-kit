import gulp from 'gulp';

// Load plugins

import sync from 'browser-sync'; // Сервер.
import changed from 'gulp-changed'; // Перевірка файлів.
import clean from 'gulp-clean'; // Видалення Build.
import gulpif from 'gulp-if'; // Режим dev or production.
import newer from 'gulp-newer'; // Перевірка файлів.
import plumber from 'gulp-plumber'; // Пошук помилок.
import rename from 'gulp-rename'; // Rename.

import imagemin from 'gulp-imagemin'; // Оптимізація зображення.
import imageminPngquant from 'imagemin-pngquant'; // Оптимізація png only.
import imageminWebp from 'imagemin-webp'; // Конвертатор webp.

import fonter from 'gulp-fonter'; // Конвертатор шрифтів в woff.
import fontfacegen from 'gulp-fontfacegen'; // fontface gen.
import ttf2woff2 from 'gulp-ttf2woff2'; // Конвертатор в woff2.

import fileinclude from 'gulp-file-include'; // Модульність для html.
import htmlmin from 'gulp-htmlmin'; // Мінімізація html.
import typograf from 'gulp-typograf'; // Правопис.
import version from 'gulp-version-number'; // Build version.

import autoprefixer from 'gulp-autoprefixer'; // Додавання префіксів для сумісності.
import csso from 'gulp-csso'; // Minimize-css, group-media, optimize.
import groupCSSMedia from 'gulp-group-css-media-queries'; // Групування медіа-запитів.
import gulpSass from 'gulp-sass'; // Препроцесор для css.
import shorthand from 'gulp-shorthand'; // Shorthand css properties.
import sass from 'sass'; // Препроцесор для css.

import babel from 'gulp-babel'; // Підтримка старих браузерів JS.
import concat from 'gulp-concat'; // Перейменування та об'єднання.
import terser from 'gulp-terser'; // Мінімізація JS.
// const typescript = require('gulp-typescript'); //Конвертатор TypeScript в JS.

import cheerio from 'gulp-cheerio'; // Видалення непотрібних атрибутів svg (Вбудовані стилі).
import replace from 'gulp-replace'; // Заміна символів після gulp-cheerio.
import svgSprite from 'gulp-svg-sprite'; // Об'єднання спрайтів.
import svgmin from 'gulp-svgmin'; // Мінімізація svg.

/* ____________________________________________ */
// JS Concat Order
import { readFileSync } from 'fs';

const srcJs = JSON.parse(readFileSync('./src/js/modules.json'));
// import srcJs from './src/js/modules.json' assert { type: "json" }; // ES6 Warning "assert"

const browsersync = sync.create();
const scss = gulpSass(sass);

/* ____________________________________________ */
// Production build

const isBuild = process.argv.includes('--production');
const isDev = !isBuild;

// Cleaner

function clear() {
	return gulp.src('build/*', { read: false })
		.pipe(gulpif(isBuild, clean()));
}

function clr() {
	return gulp.src(
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
	return gulp.src('src/scss/libs/_font.{scss,sass}', {
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
	return (gulp.src(ttfTOwoff2)
		.pipe(changed('build/font/', { extension: '.woff2' }))
		.pipe(ttf2woff2())
		.pipe(gulp.dest('build/font/'))

	// .pipe(src(ttfTOwoff))
	// .pipe(changed('build/font/', { extension: '.woff' }))
	// .pipe(fonter({ formats: ['woff'] }))
	// .pipe(dest('build/font/'))

		.pipe(gulp.src(copySvgFont))
		.pipe(changed('build/font/', { extension: '.svg' }))
		.pipe(gulp.dest('build/font/'))
	);
}

function fontgen() {
	// const tffTOtff = 'src/assets/font/**/*.ttf'; //Extra optimization /needs test/
	const otfTOtff = 'src/assets/font/**/*.{otf,ttf}'; // eot,otf,ttf,otc,ttc
	const fontCss = 'src/assets/font/*.*';
	return gulp.src(otfTOtff)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(gulp.dest('src/assets/font/'))
		.pipe(gulp.src(fontCss))
		.pipe(fontfacegen({
			filepath: 'src/scss/libs',
			filename: '_font.scss',
		}));
}

/* ____________________________________________ */
// Svg Sprite

function svg() {
	return gulp.src('src/assets/img/svg/*.svg')
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
			mode: { symbol: { sprite: './grouped-sprites.svg', example: true } },
		}))
		.pipe(gulp.dest('build/img/svg/'));
}

/* ____________________________________________ */
// Optimize images

function webp() {
	return gulp.src('src/assets/img/*.{png,jpg,jpeg,webp}')
		.pipe(changed('build/img/', { extension: '.webp' }))
		.pipe(imagemin([imageminWebp({ quality: 100 })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(gulp.dest('build/img/'))
		.pipe(browsersync.stream());
}

function img() {
	const srcPng = 'src/assets/img/favicon/*.png';
	const srcSvg = 'src/assets/img/**/*.{gif,svg}'; // png,jpg,jpeg
	const copyImg = 'src/assets/img/favicon/*.{ico,webmanifest,json}';
	return gulp.src(srcSvg)
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
		.pipe(gulp.dest('build/img/'))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyImg))
		.pipe(changed('build/img/'))
		.pipe(gulp.dest('build/img/favicon/'))
		.pipe(browsersync.stream())

		.pipe(gulp.src(srcPng))
		.pipe(changed('build/img/favicon/', { extension: '.png' }))
		.pipe(imagemin([imageminPngquant({ quality: [0.8, 1.0] })]))
		.pipe(gulp.dest('build/img/favicon/'))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// Html

function html() {
	const copyIcoTxt = 'src/assets/*.{ico,txt}';
	return gulp.src('src/*.html')
		.pipe(plumber())
		.pipe(fileinclude({ prefix: '@' }))
		.pipe(typograf({
			locale: ['ru', 'en-US', 'uk'], // 'ukr, uk-UA'
			htmlEntity: { type: 'name' },
		}))
		.pipe(gulpif(isBuild, version({
			value: '%DT%',
			append: { key: '_v', cover: 0, to: ['css', 'js'] },
		})))
		.pipe(htmlmin({ removeComments: isBuild, collapseWhitespace: isBuild }))
		.pipe(gulp.dest('build/'))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyIcoTxt))
		.pipe(changed('build/'))
		.pipe(gulp.dest('build/'))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// CSS

function css() {
	const copyLibsCss = 'src/scss/libs/*.css';
	return (gulp.src('src/scss/**/*.{scss,sass}', { sourcemaps: true })
		.pipe(gulpif(isDev, newer('build/css/style.min.css')))
		.pipe(scss.sync({ outputStyle: 'expanded' }).on('error', scss.logError))
		.pipe(plumber())
		.pipe(csso())
		.pipe(shorthand())
		.pipe(gulpif(isBuild, groupCSSMedia()))
		.pipe(autoprefixer({ cascade: false, grid: true }))
		.pipe(gulpif(isBuild, gulp.dest('build/css/', { sourcemaps: isBuild })))
		.pipe(gulpif(isBuild, csso()))
		.pipe(rename({ suffix: '.min', extname: '.css' }))
		.pipe(gulp.dest('build/css/', { sourcemaps: isDev }))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyLibsCss))
		.pipe(gulpif(isDev, changed('build/css/', { extension: '.css' })))
		.pipe(gulpif(isBuild, csso()))
		.pipe(gulp.dest('build/css/'))
		.pipe(browsersync.stream())
	);
}

/* ____________________________________________ */
// JavaScript
// "./src/js/*.{js,jsx,ts,tsx,vue}"

function js() {
	const copyLibsJs = 'src/js/libs/*.js';
	return (gulp.src(srcJs, { sourcemaps: true })
		.pipe(plumber())
		.pipe(gulpif(isDev, newer('build/js/script.min.js')))
	// .pipe(typescript({ noImplicitAny: true, outFile: 'script.min.js' }))
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(gulpif(isBuild, concat('script.js')))
		.pipe(gulpif(isBuild, gulp.dest('build/js/', { sourcemaps: isBuild })))
		.pipe(concat('script.min.js'))
		.pipe(gulpif(isBuild, terser()))
		.pipe(gulp.dest('build/js/', { sourcemaps: isDev }))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyLibsJs))
		.pipe(gulpif(isDev, changed('build/js/', { extension: '.js' })))
		.pipe(gulpif(isBuild, terser()))
		.pipe(gulp.dest('build/js/'))
		.pipe(browsersync.stream())
	);
}

/* ____________________________________________ */
// Watch files

function watchFiles() {
	gulp.watch('src/scss/**/*.{scss,sass}', css);
	gulp.watch('src/**/*.html', html);
	gulp.watch('src/js/**/*.{js,jsx,ts,tsx,vue}', js);
	gulp.watch('src/assets/img/**/*.{png,ico,gif,svg,webmanifest,json}', img);
	gulp.watch('src/assets/img/**/*.{png,jpg,jpeg,webp}', webp);
	gulp.watch('src/assets/font/**/*.{otf,ttf,woff,woff2,svg}', font);
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
export const watch = gulp.parallel(watchFiles, browserSync);
export default gulp.series(clr, clear, font, gulp.parallel(html, css, js, img, webp));
export const imgTask = gulp.series(webp, img);
export const fontTask = font;
export const fontgenTask = gulp.series(delfont, fontgen);
export const svgTask = svg;
export const clrTask = clr;
