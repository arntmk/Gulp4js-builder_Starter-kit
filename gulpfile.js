/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* ____________________________________________ */
// Load Gulp & WebPack
import gulp from 'gulp';
import webpack from 'webpack-stream';

// Load plugins

import sync from 'browser-sync'; // сервер.
import newer from 'gulp-newer'; // перевірка файлів.
import changed from 'gulp-changed'; // перевірка файлів.
import del from 'del'; // видалення файлів.
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
import fonter from 'gulp-fonter-2'; // конвертатор шрифтів в woff.
import ttf2woff2 from 'gulp-ttf2woff2'; // конвертатор в woff2.
import fontfacegen from 'gulp-fontfacegen'; // fontface gen.

// Html/Twig
import twig from 'gulp-twig'; // html preprocessors.
import htmlmin from 'gulp-htmlmin'; // мінімізація html.
import typograf from 'gulp-typograf'; // перевірка правопису.
import version from 'gulp-version-number'; // build version.

// CSS/SCSS
import gulpSass from 'gulp-sass'; // gulp css preprocessors.
import * as sass from 'sass'; // css preprocessors.
import scssGlob from 'gulp-sass-glob'; // global imports.
import cached from 'gulp-cached'; // optimize css rebuild.
import dependents from 'gulp-dependents'; // optimize css rebuild.
import autoprefixer from 'gulp-autoprefixer'; // css префікси для сумісності.
import shorthand from 'gulp-shorthand'; // shorthand css properties.
import cleanCSS from 'gulp-clean-css'; // мinimize-css, group-media, optimize.
import purgecss from 'gulp-purgecss'; // purge css [optimize].
import gcmq from 'gulp-group-css-media-queries'; // group-media.

// JS/TS
import terser from 'gulp-terser'; // мінімізація JS/TS.
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

const buildFolder = './build';
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
					`!${buildFolder}/*.{png,ico,txt,html,webmanifest,json}`,
					`!${buildFolder}/styles/`,
					`!${buildFolder}/styles/*.css`,
					`!${buildFolder}/styles/libs/`,
					`!${buildFolder}/styles/libs/*.css`,
					`!${buildFolder}/scripts/`,
					`!${buildFolder}/scripts/*.js`,
					`!${buildFolder}/scripts/libs/`,
					`!${buildFolder}/scripts/libs/*.js`,
					`!${buildFolder}/fonts/`,
					`!${buildFolder}/fonts/*.{woff,woff2}`,
					`!${buildFolder}/images/`,
					`!${buildFolder}/images/favicon/`,
					`!${buildFolder}/images/favicon/*.{png,svg}`,
					`!${buildFolder}/images/svg/`,
					`!${buildFolder}/images/svg/*.{gif,svg}`,
					`!${buildFolder}/images/*.webp`,
			  ]
			: 'production',
	);
}

// clear css/font-face
function delfont() {
	return del([`${srcFolder}/styles/_font.{scss,sass}`]);
}

/* ____________________________________________ */
// Fonts

function font() {
	const ttfTOwoff2 = `${srcFolder}/assets/fonts/**/*.{ttf,woff2}`;
	// const ttfTOwoff = `${srcFolder}/assets/fonts/**/*.{ttf,woff}`;
	const copySvgFont = `${srcFolder}/assets/fonts/**/*.svg`; // {eot,otf,ttf,otc,ttc}
	return (
		gulp
			.src(ttfTOwoff2)
			.pipe(gulpif(isDev, changed(`${buildFolder}/fonts/`, { extension: '.woff2' })))
			.pipe(ttf2woff2())
			.pipe(gulp.dest(`${buildFolder}/fonts/`))
			.pipe(browsersync.stream())

			// .pipe(gulp.src(ttfTOwoff))
			// .pipe(gulpif(isDev, changed(`${buildFolder}/fonts/`, { extension: '.woff' })))
			// .pipe(fonter({ formats: ['woff'] }))
			// .pipe(gulp.dest(`${buildFolder}/fonts/`))
			// .pipe(browsersync.stream())

			.pipe(gulp.src(copySvgFont))
			.pipe(gulpif(isDev, changed(`${buildFolder}/fonts/`, { extension: '.svg' })))
			.pipe(gulp.dest(`${buildFolder}/fonts/`))
			.pipe(browsersync.stream())
	);
}

function fontgen() {
	const otfTOtff = `${srcFolder}/assets/fonts/**/*.{otf,ttf}`; // tff to tff - extra optimization
	const fontCss = `${srcFolder}/assets/fonts/*.{otf,ttf,woff,woff2}`;
	return gulp
		.src(otfTOtff)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(gulp.dest(`${srcFolder}/assets/fonts/`))

		.pipe(gulp.src(fontCss))
		.pipe(
			fontfacegen({
				filepath: `${srcFolder}/styles/`,
				filename: '_font.scss',
			}),
		);
}

/* ____________________________________________ */
// Svg Sprite

function svg() {
	return gulp
		.src(`${srcFolder}/assets/images/svg/*.svg`)
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
				mode: { stack: { sprite: 'svg-sprites.svg', example: true } },
			}),
		)
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${srcFolder}/assets/images/svg/`));
}

/* ____________________________________________ */
// Optimize images | webp/svg/favicon

function img() {
	// favicon
	const srcPngFiles = [`${srcFolder}/assets/images/favicon/*.png`, `${srcFolder}/assets/*.png`];
	const copyIco = `${srcFolder}/assets/images/favicon/*.ico`;
	// content
	const srcSvgFiles = `${srcFolder}/assets/images/**/*.{gif,svg}`;
	return gulp
		.src(srcSvgFiles)
		.pipe(gulpif(isDev, changed(`${buildFolder}/images/`)))
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
		.pipe(gulp.dest(`${buildFolder}/images/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyIco))
		.pipe(changed(`${buildFolder}/images/`))
		.pipe(gulp.dest(`${buildFolder}/images/favicon/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(srcPngFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/images/favicon/`, { extension: '.png' })))
		.pipe(imagemin([imageminPngquant({ quality: [0.8, 1.0] })]))
		.pipe(gulp.dest(`${buildFolder}/images/favicon/`))
		.pipe(browsersync.stream());
}
// content
function webp() {
	return gulp
		.src([
			`${srcFolder}/assets/images/**/*.{png,jpg,jpeg,webp}`,
			`!${srcFolder}/assets/images/favicon/**/*.*`,
		])
		.pipe(gulpif(isDev, changed(`${buildFolder}/images/`, { extension: '.webp' })))
		.pipe(imagemin([imageminWebp({ quality: 100 })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(gulp.dest(`${buildFolder}/images/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// Html/Twig

function html() {
	const copyFiles = `${srcFolder}/assets/*.{png,ico,txt,webmanifest,json}`;
	return gulp
		.src([
			`${srcFolder}/*.{html,twig}`,
			`!${srcFolder}/**/_*.{html,twig}`,
			`${srcFolder}/assets/*.html`,
			`!${srcFolder}/assets/images/**/*.html`,
		])
		.pipe(gulpif(isDev, changed(`${buildFolder}/`, { hasChanged: changed.compareContents })))
		.pipe(plumber(plumberNotify('Html/Twig')))
		.pipe(twig())
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
				removeComments: isProd,
				collapseWhitespace: isProd,
				removeScriptTypeAttributes: isProd,
				removeStyleLinkTypeAttributes: isProd,
				removeEmptyAttributes: isProd,
				sortAttributes: false,
				sortClassName: false,
				minifyCSS: isProd,
				minifyJS: isProd,
			}),
		)
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/`)))
		.pipe(gulp.dest(`${buildFolder}/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// CSS/SCSS

function css() {
	return gulp
		.src(`${srcFolder}/**/*.{scss,sass}`, { sourcemaps: true })
		.pipe(gulpif(isDev, newer(`${buildFolder}/styles/style.min.css`)))
		.pipe(gulpif(isDev, cached('scss')))
		.pipe(gulpif(isDev, dependents()))
		.pipe(scssGlob())
		.pipe(
			scss
				.sync({ outputStyle: 'expanded', includePaths: ['/node_modules/'] })
				.on('error', scss.logError),
		)
		.pipe(plumber(plumberNotify('CSS/SCSS')))
		.pipe(rename({ suffix: '.min', extname: '.css' }))
		.pipe(gulp.dest(`${buildFolder}/styles/`, { sourcemaps: isDev }))
		.pipe(browsersync.stream());
}

function libsCss() {
	const LibsCssFiles = `${srcFolder}/styles/libs/*.css`;
	return gulp
		.src(LibsCssFiles)
		.pipe(gulpif(isDev, changed(`${buildFolder}/styles/libs/`, { extension: '.css' })))
		.pipe(gulpif(isProd, cleanCSS({ level: { 2: { restructureRules: true, mergeMedia: false } } })))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/styles/libs/`));
}

function optCss() {
	const purgeCssFiles = [`${buildFolder}/styles/*.css`, `!${buildFolder}/styles/vendor.min.js`];
	return gulpif(isProd, gulp.src(purgeCssFiles))
		.pipe(
			purgecss({
				content: [`${srcFolder}/**/*.{html,twig,js}`],
				skippedContentGlobs: ['node_modules/**', 'bower_components/**'],
				safelist: [':where', ':is', ':has', 'hidden', 'active', 'open', 'lock-fixed', 'lock'],
				keyframes: true,
				variables: false,
				fontFace: false,
			}),
		)
		.pipe(gcmq())
		.pipe(shorthand())
		.pipe(cleanCSS({ level: { 2: { restructureRules: true, mergeMedia: true } } }))
		.pipe(autoprefixer({ cascade: false, grid: true }))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/styles/`));
}

/* ____________________________________________ */
// JS/TS

function js() {
	return gulp
		.src(`${srcFolder}/*.{js,ts}`) // WebPack entry
		.pipe(
			gulpif(isDev, changed(`${buildFolder}/scripts/`, { hasChanged: changed.compareContents })),
		)
		.pipe(plumber(plumberNotify('JS/TS')))
		.pipe(webpack(webpackConfig).on('error', WebPackError))
		.pipe(gulp.dest(`${buildFolder}/scripts/`))
		.pipe(browsersync.stream());
}

function libsJs() {
	const LibsJsFiles = `${srcFolder}/scripts/libs/*.js`;
	return gulp
		.src(LibsJsFiles)
		.pipe(gulpif(isDev, changed(`${buildFolder}/scripts/libs/`, { extension: '.js' })))
		.pipe(gulpif(isProd, terser()))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/scripts/libs/`));
}

/* ____________________________________________ */
// Watch files

function watchFiles() {
	gulp.watch(`${srcFolder}/**/*.{html,twig}`, html);
	gulp.watch(`${srcFolder}/**/*.{scss,sass}`, css, libsCss);
	gulp.watch(`${srcFolder}/**/*.{js,ts}`, js, libsJs);
	gulp.watch(`${srcFolder}/assets/images/**/*.{ico,gif,svg,png,jpg,jpeg,webp}`, img, webp);
	gulp.watch(`${srcFolder}/assets/fonts/**/*.{otf,ttf,woff,woff2,svg}`, font);
}

// BrowserSync

function browserSync() {
	browsersync.init({
		server: { baseDir: `${buildFolder}` },
		notify: false,
		online: true, // online (Local Router)
		tunnel: false, // online (Internet)
		port: 3015,
		ui: false,
		logFileChanges: true,
		logConnections: false,
		browser: ['chrome'], // , 'firefox'
	});
}

/* ____________________________________________ */
export const watch = gulp.parallel(watchFiles, browserSync);
export const fontTask = font;
export const fontGenTask = gulp.parallel(delfont, fontgen);
export const imgTask = gulp.parallel(img, webp);
export const svgSptTask = svg;
export const htmlTask = html;
export const cssTask = gulp.series(gulp.parallel(css, libsCss), optCss);
export const jsTask = gulp.parallel(js, libsJs);
export const delTask = delDev;
export default gulp.series(delDev, delProd, gulp.parallel(html, jsTask, cssTask, imgTask, font));
