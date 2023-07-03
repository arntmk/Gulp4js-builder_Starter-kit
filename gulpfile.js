/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* const { src, dest, parallel, series, watch } = require('gulp'); */
/* ____________________________________________ */
// Load Gulp & WebPack
import gulp from 'gulp';
import webpack from 'webpack-stream';

// Load plugins

import sync from 'browser-sync'; // сервер.
import newer from 'gulp-newer'; // перевірка файлів.
import changed from 'gulp-changed'; // перевірка файлів.
import del from 'del'; // видалення build.
import gulpif from 'gulp-if'; // режим dev or production.
import plumber from 'gulp-plumber'; // пошук помилок.
import notify from 'gulp-notify'; // сповіщення.
import rename from 'gulp-rename'; // rename.
import size from 'gulp-size'; // size.

// Svg Sprite
import svgmin from 'gulp-svgmin'; // мінімізація svg.
import cheerio from 'gulp-cheerio'; // видалення непотрібних атрибутів svg (Вбудовані стилі).
import replace from 'gulp-replace'; // заміна символів після gulp-cheerio.
import svgSprite from 'gulp-svg-sprite'; // об'єднання спрайтів.

// Optimize images
import imagemin from 'gulp-imagemin'; // оптимізація зображення.
import imageminPngquant from 'imagemin-pngquant'; // оптимізація png only.
import imageminWebp from 'imagemin-webp'; // конвертатор webp.

// Font
import fonter from 'gulp-fonter'; // конвертатор шрифтів в woff.
import ttf2woff2 from 'gulp-ttf2woff2'; // конвертатор в woff2.
import fontfacegen from 'gulp-fontfacegen'; // fontface gen.

// Html/Pug
import fileinclude from 'gulp-file-include'; // include html.
import htmlmin from 'gulp-htmlmin'; // мінімізація html.
import typograf from 'gulp-typograf'; // перевірка правопису.
import version from 'gulp-version-number'; // build version.

// CSS/SCSS
import gulpSass from 'gulp-sass'; // препроцесор для css.
import * as sass from 'sass'; // препроцесор для css.
import scssGlob from 'gulp-sass-glob'; // global imports.
import autoprefixer from 'gulp-autoprefixer'; // css префікси для сумісності.
import shorthand from 'gulp-shorthand'; // shorthand css properties.
import cleanCSS from 'gulp-clean-css'; // мinimize-css, group-media, optimize.
import cached from 'gulp-cached'; // optimize css rebuild.
import dependents from 'gulp-dependents'; // optimize css rebuild.

// JS/TS
import terser from 'gulp-terser'; // мінімізація JS.
import webpackConfig from './webpack.config.js'; // webpackConfig

/* ____________________________________________ */
/* ____________________________________________ */
/* ____________________________________________ */
// Import BrowserSync || Import SCSS
const browsersync = sync.create();
const scss = gulpSass(sass);

/* ____________________________________________ */
// Production mode | Build

const isProd = process.argv.includes('--production');
const isDev = !isProd;

/* ____________________________________________ */
// Paths

const buildFolder = './public';
const srcFolder = './src';

/* ____________________________________________ */
// Notify
const plumberNotify = (title) => ({
	errorHandler: notify.onError({
		title,
		message: 'Error <%= error.message %>',
		sound: false,
	}),
});

const WebPackError = () => ({
	function(err) {
		console.error('WEBPACK ERROR', err);
		this.emit('end');
	},
});

/* ____________________________________________ */
/* ____________________________________________ */
/* ____________________________________________ */
// Cleaner

function delProd() {
	return del(isProd ? `${buildFolder}/**` : 'development');
}

function delDev() {
	return del(
		isDev
			? [
					`${buildFolder}/**`,
					`!${buildFolder}/css/`,
					`!${buildFolder}/js/`,
					`!${buildFolder}/font/`,
					`!${buildFolder}/img/`,
					`!${buildFolder}/img/favicon/`,
					`!${buildFolder}/img/svg/`,
					`!${buildFolder}/*.{html,ico,txt}`,
					`!${buildFolder}/css/*.css`,
					`!${buildFolder}/js/*.js`,
					`!${buildFolder}/font/*.{woff,woff2}`,
					`!${buildFolder}/img/*.webp`,
					`!${buildFolder}/img/favicon/*.{png,svg}`,
					`!${buildFolder}/img/svg/*.{gif,svg}`,
			  ]
			: 'production',
	);
}

// clear css/font-face
function delfont() {
	return del([`${srcFolder}/scss/_font.{scss,sass}`]);
}

/* ____________________________________________ */
// Fonts

function font() {
	const ttfTOwoff2 = `${srcFolder}/assets/font/**/*.{ttf,woff2}`;
	// const ttfTOwoff = `${srcFolder}/assets/font/**/*.{ttf,woff}`;
	const copySvgFont = `${srcFolder}/assets/font/**/*.svg`; // {eot,otf,ttf,otc,ttc}
	return (
		gulp
			.src(ttfTOwoff2)
			.pipe(gulpif(isDev, changed(`${buildFolder}/font/`, { extension: '.woff2' })))
			.pipe(ttf2woff2())
			.pipe(gulp.dest(`${buildFolder}/font/`))
			.pipe(browsersync.stream())

			// .pipe(gulp.src(ttfTOwoff))
			// .pipe(gulpif(isDev, changed(`${buildFolder}/font/`, { extension: '.woff' })))
			// .pipe(fonter({ formats: ['woff'] }))
			// .pipe(gulp.dest(`${buildFolder}/font/`))
			// .pipe(browsersync.stream())

			.pipe(gulp.src(copySvgFont))
			.pipe(gulpif(isDev, changed(`${buildFolder}/font/`, { extension: '.svg' })))
			.pipe(gulp.dest(`${buildFolder}/font/`))
			.pipe(browsersync.stream())
	);
}

function fontgen() {
	const otfTOtff = `${srcFolder}/assets/font/**/*.{otf,ttf}`; // tff to tff - extra optimization
	const fontCss = `${srcFolder}/assets/font/*.{otf,ttf,woff,woff2}`;
	return gulp
		.src(otfTOtff)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(gulp.dest(`${srcFolder}/assets/font/`))

		.pipe(gulp.src(fontCss))
		.pipe(
			fontfacegen({
				filepath: `${srcFolder}/scss`,
				filename: '_font.scss',
			}),
		);
}

/* ____________________________________________ */
// Svg Sprite

function svg() {
	return gulp
		.src(`${srcFolder}/img/svg/*.svg`)
		.pipe(plumber(plumberNotify('Svg-Sprite')))
		.pipe(svgmin({ js2svg: { pretty: true } }))
		.pipe(
			cheerio({
				run($) {
					// $('[fill]').removeAttr('fill');
					// $('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
					$('[class]').removeAttr('class');
					$('[data-name]').removeAttr('data-name');
				},
				parserOptions: { xmlMode: true },
			}),
		)
		.pipe(replace('&gt;', '>'))
		.pipe(
			svgSprite({
				mode: { stack: { sprite: '../svg-sprite.svg', example: true } },
			}),
		)
		.pipe(gulp.dest(`${srcFolder}/img/svg/`));
}

/* ____________________________________________ */
// Optimize images | webp/svg/favicon

function img() {
	// favicon
	const srcPngFiles = [`${srcFolder}/img/favicon/*.png`, `!${srcFolder}/*.png`];
	const copyManifest = `${srcFolder}/img/favicon/*.{ico,webmanifest,json}`;
	// content
	const srcSvgFiles = `${srcFolder}/img/**/*.{gif,svg}`;
	return gulp
		.src(srcSvgFiles)
		.pipe(gulpif(isDev, changed(`${buildFolder}/img/`)))
		.pipe(
			imagemin(
				[
					imagemin.gifsicle({ interlaced: true }),
					// imagemin.mozjpeg({ quality: 80, progressive: true }),
					// imagemin.optipng({ optimizationLevel: 5 }),
					imagemin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
					}),
				],
				{ verbose: true },
			),
		)
		.pipe(gulp.dest(`${buildFolder}/img/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyManifest))
		.pipe(gulpif(isDev, changed(`${buildFolder}/img/`)))
		.pipe(gulp.dest(`${buildFolder}/img/favicon/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(srcPngFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/img/favicon/`, { extension: '.png' })))
		.pipe(imagemin([imageminPngquant({ quality: [0.8, 1.0] })]))
		.pipe(gulp.dest(`${buildFolder}/img/favicon/`))
		.pipe(browsersync.stream());
}

// content
function webp() {
	return gulp
		.src([`${srcFolder}/img/**/*.{png,jpg,jpeg,webp}`, `!${srcFolder}/img/favicon/**/*.*`])
		.pipe(gulpif(isDev, changed(`${buildFolder}/img/`, { extension: '.webp' })))
		.pipe(imagemin([imageminWebp({ quality: 100 })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(gulp.dest(`${buildFolder}/img/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// Html/Pug

function html() {
	const copyFavicon = `${srcFolder}/assets/*.{png,ico,txt}`;
	return gulp
		.src([
			`${srcFolder}/**/*.html`,
			`!${srcFolder}/components/**/*.html`,
			`!${srcFolder}/img/**/*.html`,
		])
		.pipe(gulpif(isDev, changed(`${buildFolder}/`, { hasChanged: changed.compareContents })))
		.pipe(plumber(plumberNotify('Html/Pug')))
		.pipe(fileinclude({ prefix: '@', basepath: '@file' }))
		.pipe(
			typograf({
				locale: ['ru', 'en-US', 'uk'], // 'uk-UA'
				htmlEntity: { type: 'name' },
			}),
		)
		.pipe(
			gulpif(
				isProd,
				version({
					value: '%DT%',
					append: { key: '_v', cover: 0, to: ['image', 'css', 'js', 'preload'] },
				}),
			),
		)
		.pipe(
			htmlmin({
				removeComments: true,
				collapseWhitespace: isProd,
				removeScriptTypeAttributes: isProd,
				removeStyleLinkTypeAttributes: isProd,
			}),
		)
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyFavicon))
		.pipe(gulpif(isDev, changed(`${buildFolder}/`)))
		.pipe(gulp.dest(`${buildFolder}/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// CSS/SCSS

function css() {
	const LibsCssFiles = `${srcFolder}/scss/libs/*.css`;
	return gulp
		.src(`${srcFolder}/**/*.{scss,sass}`, { sourcemaps: true })
		.pipe(gulpif(isDev, newer(`${buildFolder}/css/style.min.css`)))
		.pipe(gulpif(isDev, cached('scss')))
		.pipe(gulpif(isDev, dependents()))
		.pipe(scssGlob())
		.pipe(scss.sync({ outputStyle: 'expanded' }).on('error', scss.logError))
		.pipe(plumber(plumberNotify('CSS/SCSS')))
		.pipe(gulpif(isProd, shorthand()))
		.pipe(gulpif(isProd, autoprefixer({ cascade: false, grid: true })))
		.pipe(gulpif(isProd, cleanCSS({ level: 2 })))
		.pipe(gulpif(isProd, shorthand()))
		.pipe(gulpif(isProd, gulp.dest(`${buildFolder}/css/`)))

		.pipe(gulpif(isProd, cleanCSS({ level: 2 })))
		.pipe(rename({ suffix: '.min', extname: '.css' }))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/css/`, { sourcemaps: isDev }))
		.pipe(browsersync.stream())

		.pipe(gulp.src(LibsCssFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/css/`, { extension: '.css' })))
		.pipe(gulpif(isProd, cleanCSS({ level: 2 })))
		.pipe(gulp.dest(`${buildFolder}/css/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// JS/TS

function js() {
	const LibsJsFiles = `${srcFolder}/js/libs/*.js`;
	return gulp
		.src([`${srcFolder}/script.js`, `${srcFolder}/*.{js,ts}`]) // WebPack entry
		.pipe(gulpif(isDev, changed(`${buildFolder}/js/`, { hasChanged: changed.compareContents })))
		.pipe(plumber(plumberNotify('JS/TS')))
		.pipe(gulpif(isProd, webpack(webpackConfig)))
		.pipe(gulpif(isProd, rename('script.js')))
		.pipe(gulpif(isProd, gulp.dest(`${buildFolder}/js/`)))

		.pipe(webpack(webpackConfig).on('error', WebPackError))
		.pipe(gulp.dest(`${buildFolder}/js/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(LibsJsFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/js/`, { extension: '.js' })))
		.pipe(gulpif(isProd, terser()))
		.pipe(gulp.dest(`${buildFolder}/js/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// Watch files

function watchFiles() {
	gulp.watch(`${srcFolder}/**/*.html`, html);
	gulp.watch(`${srcFolder}/**/*.{scss,sass}`, css);
	gulp.watch(`${srcFolder}/**/*.{js,ts}`, js);
	gulp.watch(`${srcFolder}/img/**/*.{png,ico,gif,svg,webmanifest,json}`, img);
	gulp.watch(`${srcFolder}/img/**/*.{png,jpg,jpeg,webp}`, webp);
	gulp.watch(`${srcFolder}/assets/font/**/*.{otf,ttf,woff,woff2,svg}`, font);
}

// BrowserSync

function browserSync() {
	browsersync.init({
		server: { baseDir: `${buildFolder}` },
		notify: false,
		online: false, // online (Local Router)
		tunnel: false, // online (Internet)
		port: 3015,
		ui: false,
		logFileChanges: false,
		logConnections: false,
		browser: ['chrome'], // , 'firefox'
	});
}

/* ____________________________________________ */
export const watch = gulp.parallel(watchFiles, browserSync);
export default gulp.series(delDev, delProd, gulp.parallel(html, css, js, img, webp, font));
export const fontTask = font;
export const fontGenTask = gulp.parallel(delfont, fontgen);
export const imgTask = gulp.parallel(webp, img);
export const svgSptTask = svg;
export const htmlTask = html;
export const cssTask = css;
export const jsTask = js;
export const delTask = delDev;
