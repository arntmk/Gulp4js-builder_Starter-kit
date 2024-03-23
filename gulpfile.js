/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* ____________________________________________ */
// Load Gulp & WebPack

import gulp from 'gulp';
import webpack from 'webpack-stream';

// Load plugins

import sync from 'browser-sync'; // сервер.
import newer from 'gulp-newer'; // перевірка файлів.
import changed from 'gulp-changed'; // перевірка файлів. || ESM Only
import { deleteAsync } from 'del'; // видалення файлів. || ESM Only
import gulpif from 'gulp-if'; // режим dev or production.
import plumber from 'gulp-plumber'; // пошук помилок.
import notify from 'gulp-notify'; // сповіщення.
import rename from 'gulp-rename'; // rename.
import size from 'gulp-size'; // size. || ESM Only

// Svg Sprite
import svgmin from 'gulp-svgmin'; // мінімізація svg.
import cheerio from 'gulp-cheerio'; // видалення непотрібних атрибутів svg (Вбудовані стилі).
import replace from 'gulp-replace'; // заміна символів після gulp-cheerio.
import svgSprite from 'gulp-svg-sprite'; // об'єднання спрайтів.

// Optimize images
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'; // оптимізація зображення. || ESM Only
import imageminPngquant from 'imagemin-pngquant'; // оптимізація png only.
import imageminWebp from 'imagemin-webp'; // конвертатор webp. || ESM Only

// Font
import fonter from 'gulp-fonter-2'; // конвертатор шрифтів в woff.
import ttf2woff2 from 'gulp-ttf2woff2'; // конвертатор в woff2.
import fontfacegen from 'gulp-fontfacegen'; // fontface gen.

// Html/Twig
import twig from 'gulp-twig'; // html preprocessors.
import twigData from 'gulp-data';
import htmlmin from 'gulp-htmlmin'; // мінімізація html.
import typograf from 'gulp-typograf'; // перевірка правопису.
import version from 'gulp-version-number'; // build version.

// CSS/SCSS
import gulpSass from 'gulp-sass'; // gulp css preprocessors.
import * as sass from 'sass'; // css preprocessors.
import scssGlob from 'gulp-sass-glob'; // global imports.
import cached from 'gulp-cached'; // optimize css rebuild.
import dependents from 'gulp-dependents'; // optimize css rebuild.
import shorthand from 'gulp-shorthand'; // shorthand css properties.
import cleanCSS from 'gulp-clean-css'; // мinimize-css, group-media, optimize.
import postcss from 'gulp-postcss'; // postcss.
import presetEnv from 'postcss-preset-env'; // Include: autoprefixer

// JS/TS
import terser from 'gulp-terser'; // мінімізація JS/TS.

/* ____________________________________________ */
// Config
import webpackConfig from './webpack.config.js'; // webpackConfig
import postcssConfig from './postcss.config.js'; // postcssConfig
import dataConfig from './src/database.json' assert { type: 'json' }; // dataConfig

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

export const paths = {
	purgecss: `${srcFolder}/**/*.{html,htm,php,twig,hbs,njk,js,ts}`, // jsx,tsx,vue
};

/* ____________________________________________ */
// Notify.onError

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
	return deleteAsync(isProd ? `${buildFolder}/**` : 'development');
}

function delDev() {
	return deleteAsync(
		isDev
			? [
					`${buildFolder}/**`,
					`!${buildFolder}/*.{png,ico,txt,html,php,webmanifest,json}`,
					`!${buildFolder}/template/styles/`,
					`!${buildFolder}/template/styles/*.css`,
					`!${buildFolder}/template/styles/libs/`,
					`!${buildFolder}/template/styles/libs/*.css`,
					`!${buildFolder}/template/scripts/`,
					`!${buildFolder}/template/scripts/*.js`,
					`!${buildFolder}/template/scripts/libs/`,
					`!${buildFolder}/template/scripts/libs/*.js`,
					`!${buildFolder}/template/fonts/`,
					`!${buildFolder}/template/fonts/*.{woff,woff2}`,
					`!${buildFolder}/template/images/`,
					`!${buildFolder}/template/images/favicon/`,
					`!${buildFolder}/template/images/favicon/*.{png,svg}`,
					`!${buildFolder}/template/images/svg/`,
					`!${buildFolder}/template/images/svg/*.{gif,svg}`,
					`!${buildFolder}/template/images/*.webp`,
			  ]
			: 'production',
	);
}

// clear css/font-face
function delfont() {
	return deleteAsync([`${srcFolder}/styles/_font.{scss,sass}`]);
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
			.pipe(gulpif(isDev, changed(`${buildFolder}/template/fonts/`, { extension: '.woff2' })))
			.pipe(ttf2woff2())
			.pipe(gulp.dest(`${buildFolder}/template/fonts/`))
			.pipe(browsersync.stream())

			// .pipe(gulp.src(ttfTOwoff))
			// .pipe(gulpif(isDev, changed(`${buildFolder}/template/fonts/`, { extension: '.woff' })))
			// .pipe(fonter({ formats: ['woff'] }))
			// .pipe(gulp.dest(`${buildFolder}/template/fonts/`))
			// .pipe(browsersync.stream())

			.pipe(gulp.src(copySvgFont))
			.pipe(gulpif(isDev, changed(`${buildFolder}/template/fonts/`, { extension: '.svg' })))
			.pipe(gulp.dest(`${buildFolder}/template/fonts/`))
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
		.pipe(gulpif(isDev, changed(`${buildFolder}/template/images/`)))
		.pipe(
			imagemin(
				[
					gifsicle({ interlaced: true }),
					// mozjpeg({ quality: 80, progressive: true }),
					// optipng({ optimizationLevel: 5 }),
					svgo({
						plugins: [
							{ name: 'removeViewBox', active: true },
							{ name: 'cleanupIDs', active: false },
						],
					}),
				],
				{ verbose: true },
			),
		)
		.pipe(gulp.dest(`${buildFolder}/template/images/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(copyIco))
		.pipe(changed(`${buildFolder}/template/images/`))
		.pipe(gulp.dest(`${buildFolder}/template/images/favicon/`))
		.pipe(browsersync.stream())

		.pipe(gulp.src(srcPngFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/template/images/favicon/`, { extension: '.png' })))
		.pipe(imagemin([imageminPngquant({ quality: [0.8, 1.0] })]))
		.pipe(gulp.dest(`${buildFolder}/template/images/favicon/`))
		.pipe(browsersync.stream());
}
// content
function webp() {
	return gulp
		.src([
			`${srcFolder}/assets/images/**/*.{png,jpg,jpeg,webp}`,
			`!${srcFolder}/assets/images/favicon/**/*.*`,
		])
		.pipe(gulpif(isDev, changed(`${buildFolder}/template/images/`, { extension: '.webp' })))
		.pipe(imagemin([imageminWebp({ quality: 85, method: 6 })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(gulp.dest(`${buildFolder}/template/images/`))
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
		.pipe(plumber(plumberNotify('Html/Twig')))
		.pipe(twigData(dataConfig))
		.pipe(twig())
		.pipe(
			replace(
				/(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1./$4$5$7$1',
			),
		)
		.pipe(
			typograf({
				locale: ['ru', 'en-US', 'uk'], // 'uk-UA'
				htmlEntity: { type: 'name' },
				safeTags: [
					['<\\?php', '\\?>'],
					['<no-typography>', '</no-typography>'],
				],
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
		.pipe(gulpif(isDev, newer(`${buildFolder}/template/styles/**`, { extension: '.css' })))
		.pipe(gulpif(isDev, cached('scss')))
		.pipe(gulpif(isDev, dependents()))
		.pipe(scssGlob())
		.pipe(
			scss
				.sync({ outputStyle: 'expanded', includePaths: ['node_modules/bootstrap/scss/'] })
				.on('error', scss.logError),
		)
		.pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1$2$3$4$6$1',
			),
		)
		.pipe(plumber(plumberNotify('CSS/SCSS')))
		.pipe(gulpif(isDev, postcss([presetEnv({ autoprefixer: false })])))
		.pipe(rename({ suffix: '.min', extname: '.css' }))
		.pipe(gulp.dest(`${buildFolder}/template/styles/`, { sourcemaps: isDev }))
		.pipe(browsersync.stream());
}

function libsCss() {
	const LibsCssFiles = `${srcFolder}/styles/libs/*.css`;
	return gulp
		.src(LibsCssFiles)
		.pipe(gulpif(isDev, changed(`${buildFolder}/template/styles/libs/**`, { extension: '.css' })))
		.pipe(gulpif(isProd, cleanCSS({ level: { 2: { restructureRules: true, mergeMedia: false } } })))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/template/styles/libs/`));
}

function optCss() {
	const purgeCssFiles = [
		`${buildFolder}/template/styles/*.css`,
		`!${buildFolder}/template/styles/vendor.min.css`,
	];
	return gulpif(isProd, gulp.src(purgeCssFiles))
		.pipe(shorthand())
		.pipe(postcss(postcssConfig))
		.pipe(cleanCSS({ level: { 2: { restructureRules: true } } }))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/template/styles/`));
}

/* ____________________________________________ */
// JS/TS

function js() {
	return gulp
		.src(`${srcFolder}/*.{js,ts}`) // WebPack entry
		.pipe(plumber(plumberNotify('JS/TS')))
		.pipe(webpack(webpackConfig).on('error', WebPackError))
		.pipe(gulp.dest(`${buildFolder}/template/scripts/`))
		.pipe(browsersync.stream());
}

function libsJs() {
	const LibsJsFiles = `${srcFolder}/scripts/libs/*.js`;
	return gulp
		.src(LibsJsFiles)
		.pipe(gulpif(isDev, changed(`${buildFolder}/template/scripts/libs/`, { extension: '.js' })))
		.pipe(gulpif(isProd, terser()))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${buildFolder}/template/scripts/libs/`));
}

/* ____________________________________________ */
// Watch files

function watchFiles() {
	gulp.watch(srcFolder + '/**/*.{html,twig}', html);
	gulp.watch(srcFolder + '/**/*.{scss,sass}', css, libsCss);
	gulp.watch(srcFolder + '/**/*.{js,ts}', js, libsJs);
	gulp.watch(srcFolder + '/assets/images/**/*.{ico,gif,svg,png,jpg,jpeg,webp}', img, webp);
	gulp.watch(srcFolder + '/assets/fonts/**/*.{otf,ttf,woff,woff2,svg}', font);
}

// BrowserSync

function browserSync() {
	browsersync.init({
		server: { baseDir: `${buildFolder}` },
		// proxy: 'local.dev', // php server
		notify: false,
		online: true, // online (Local Router)
		tunnel: false, // online (Internet)
		port: 3015,
		ui: false,
		logFileChanges: true,
		logConnections: false,
		browser: ['chrome'], // , 'firefox','chrome'
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
export const delTask = delProd;
export default gulp.series(delDev, delProd, gulp.parallel(html, jsTask, cssTask, imgTask, font));
