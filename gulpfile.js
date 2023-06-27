/* eslint-disable no-console */
/* ____________________________________________ */
// Load Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Load plugins

const browsersync = require('browser-sync').create(); // сервер.
const newer = require('gulp-newer'); // перевірка файлів.
const changed = require('gulp-changed'); // перевірка файлів.
const clean = require('gulp-clean'); // видалення build.
const gulpif = require('gulp-if'); // режим dev or production.
const plumber = require('gulp-plumber'); // пошук помилок.
const rename = require('gulp-rename'); // rename.

const imagemin = require('gulp-imagemin'); // оптимізація зображення.
const imageminPngquant = require('imagemin-pngquant'); // оптимізація png only.
const imageminWebp = require('imagemin-webp'); // конвертатор webp.

const fonter = require('gulp-fonter'); // конвертатор шрифтів в woff.
const ttf2woff2 = require('gulp-ttf2woff2'); // конвертатор в woff2.
const fontfacegen = require('gulp-fontfacegen'); // fontface gen.

const fileinclude = require('gulp-file-include'); // модульність для html.
const htmlmin = require('gulp-htmlmin'); // мінімізація html.
const typograf = require('gulp-typograf'); // правопис.
const version = require('gulp-version-number'); // build version.

const sass = require('gulp-sass')(require('sass')); // препроцесор для css.
const autoprefixer = require('gulp-autoprefixer'); // додавання префіксів для сумісності.
const groupCSSMedia = require('gulp-group-css-media-queries'); // групування медіа-запитів.
const shorthand = require('gulp-shorthand'); // shorthand css properties.
const cleanCSS = require('gulp-clean-css'); // мinimize-css, group-media, optimize.

const terser = require('gulp-terser'); // мінімізація JS.
// const babel = require('gulp-babel'); // підтримка старих браузерів JS.
// const concat = require('gulp-concat'); // перейменування та об'єднання.
// const typescript = require('gulp-typescript'); // конвертатор TypeScript в JS.
const webpack = require('webpack-stream');

const svgmin = require('gulp-svgmin'); // мінімізація svg.
const cheerio = require('gulp-cheerio'); // видалення непотрібних атрибутів svg (Вбудовані стилі).
const replace = require('gulp-replace'); // заміна символів після gulp-cheerio.
const svgSprite = require('gulp-svg-sprite'); // об'єднання спрайтів.

/* ____________________________________________ */
// Production mode | Build

const isBuild = process.argv.includes('--production');
const isDev = !isBuild;

/* ____________________________________________ */
// Webpack Config

const webpackConfig = {
	mode: isBuild ? 'production' : 'development',
	entry: {
		app: './src/script.js',
	},
	output: {
		filename: 'script.min.js',
	},
	module: {
		rules: [
			{
				test: /\.m?(js|ts)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: 'defaults',
								},
							],
						],
					},
				},
			},
		],
	},
	devtool: isDev ? 'inline-source-map' : false,
};

/* ____________________________________________ */
// Paths

const buildFolder = './build';
const srcFolder = './src';

/* ____________________________________________ */
// Cleaner

function clear() {
	return src(`${buildFolder}/*`, { read: false }).pipe(gulpif(isBuild, clean()));
}

function clr() {
	return src(
		[
			`${buildFolder}/*.*`,
			`${buildFolder}/css/*`,
			`${buildFolder}/js/*`,
			`${buildFolder}/img/**/*.{webmanifest,json}`,
			`${buildFolder}/font/**/*.{otf,ttf}`,
		],
		{ read: false },
	).pipe(gulpif(isDev, clean()));
}

function delfont() {
	return src(`${srcFolder}/scss/_font.{scss,sass}`, {
		allowEmpty: true,
		read: false,
	}).pipe(clean());
}

/* ____________________________________________ */
// Fonts

function font() {
	const ttfTOwoff2 = `${srcFolder}/assets/font/**/*.{ttf,woff2}`;
	// const ttfTOwoff = `${srcFolder}/assets/font/**/*.{ttf,woff}`;
	const copySvgFont = `${srcFolder}/assets/font/**/*.svg`; // eot,otf,ttf,otc,ttc
	return (
		src(ttfTOwoff2)
			.pipe(changed(`${buildFolder}/font/`, { extension: '.woff2' }))
			.pipe(ttf2woff2())
			.pipe(dest(`${buildFolder}/font/`))
			.pipe(browsersync.stream())

			// .pipe(src(ttfTOwoff))
			// .pipe(changed(`${buildFolder}/font/`, { extension: '.woff' }))
			// .pipe(fonter({ formats: ['woff'] }))
			// .pipe(dest(`${buildFolder}/font/`))
			// .pipe(browsersync.stream())

			.pipe(src(copySvgFont))
			.pipe(changed(`${buildFolder}/font/`, { extension: '.svg' }))
			.pipe(dest(`${buildFolder}/font/`))
			.pipe(browsersync.stream())
	);
}

function fontgen() {
	const otfTOtff = `${srcFolder}/assets/font/**/*.{otf,ttf}`; // tff to tff - extra optimization
	const fontCss = `${srcFolder}/assets/font/*.{otf,ttf,woff,woff2}`;
	return src(otfTOtff)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(dest(`${srcFolder}/assets/font/`))

		.pipe(src(fontCss))
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
	return src(`${srcFolder}/img/svg/*.svg`)
		.pipe(plumber())
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
		.pipe(dest(`${srcFolder}/img/svg/`));
}

/* ____________________________________________ */
// Optimize images | webp/svg/favicon

function img() {
	// favicon
	const srcPngFiles = [`${srcFolder}/img/favicon/*.png`, `${srcFolder}/*.png`];
	const copyManifest = `${srcFolder}/img/favicon/*.{ico,webmanifest,json}`;
	// content
	const srcSvgFiles = `${srcFolder}/img/**/*.{gif,svg}`;
	return src(srcSvgFiles)
		.pipe(changed(`${buildFolder}/img/`))
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
		.pipe(dest(`${buildFolder}/img/`))
		.pipe(browsersync.stream())

		.pipe(src(copyManifest))
		.pipe(changed(`${buildFolder}/img/`))
		.pipe(dest(`${buildFolder}/img/favicon/`))
		.pipe(browsersync.stream())

		.pipe(src(srcPngFiles))
		.pipe(changed(`${buildFolder}/img/favicon/`, { extension: '.png' }))
		.pipe(imagemin([imageminPngquant({ quality: [0.8, 1.0] })]))
		.pipe(dest(`${buildFolder}/img/favicon/`))
		.pipe(browsersync.stream());
}

// content
function webp() {
	return src([`${srcFolder}/img/**/*.{png,jpg,jpeg,webp}`, `!${srcFolder}/img/favicon/**/*.*`])
		.pipe(changed(`${buildFolder}/img/`, { extension: '.webp' }))
		.pipe(imagemin([imageminWebp({ quality: 100 })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(dest(`${buildFolder}/img/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// Html/Pug

function html() {
	const copyFavicon = `${srcFolder}/assets/*.{png,ico,txt}`;
	return src(`${srcFolder}/*.html`)
		.pipe(plumber())
		.pipe(fileinclude({ prefix: '@' }))
		.pipe(
			typograf({
				locale: ['ru', 'en-US', 'uk'], // 'uk-UA'
				htmlEntity: { type: 'name' },
			}),
		)
		.pipe(
			gulpif(
				isBuild,
				version({
					value: '%DT%',
					append: { key: '_v', cover: 0, to: ['css', 'js'] },
				}),
			),
		)
		.pipe(
			htmlmin({
				removeComments: true,
				collapseWhitespace: isBuild,
				removeScriptTypeAttributes: isBuild,
				removeStyleLinkTypeAttributes: isBuild,
			}),
		)
		.pipe(dest(`${buildFolder}`))
		.pipe(browsersync.stream())

		.pipe(src(copyFavicon))
		.pipe(changed(`${buildFolder}`))
		.pipe(dest(`${buildFolder}`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// CSS/SCSS

function css() {
	const LibsCssFiles = `${srcFolder}/scss/libs/*.css`;
	return src(`${srcFolder}/**/*.{scss,sass}`, { sourcemaps: true })
		.pipe(gulpif(isDev, newer(`${buildFolder}/css/style.min.css`)))
		.pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(plumber())
		.pipe(gulpif(isBuild, shorthand()))
		.pipe(gulpif(isBuild, groupCSSMedia()))
		.pipe(autoprefixer({ cascade: false, grid: true }))
		.pipe(gulpif(isBuild, cleanCSS({ level: 2 })))
		.pipe(gulpif(isBuild, dest(`${buildFolder}/css/`, { sourcemaps: isBuild })))

		.pipe(gulpif(isBuild, cleanCSS({ level: 2 })))
		.pipe(rename({ suffix: '.min', extname: '.css' }))
		.pipe(dest(`${buildFolder}/css/`, { sourcemaps: isDev }))
		.pipe(browsersync.stream())

		.pipe(src(LibsCssFiles))
		.pipe(gulpif(isDev, changed(`${buildFolder}/css/`, { extension: '.css' })))
		.pipe(gulpif(isBuild, cleanCSS({ level: 2 })))
		.pipe(dest(`${buildFolder}/css/`))
		.pipe(browsersync.stream());
}

/* ____________________________________________ */
// JavaScript/TypeScript

function js() {
	const LibsJsFiles = `${srcFolder}/js/libs/*.js`;
	return (
		src(`${srcFolder}/**/*.js`) // WebPack imports
			.pipe(plumber())
			.pipe(gulpif(isDev, newer(`${buildFolder}/js/script.min.js`)))
			// .pipe(typescript({ noImplicitAny: true, outFile: 'script.min.js' }))
			.pipe(gulpif(isBuild, webpack(webpackConfig)))
			.pipe(gulpif(isBuild, rename('script.js')))
			.pipe(gulpif(isBuild, dest(`${buildFolder}/js/`)))

			.pipe(webpack(webpackConfig))
			.on('error', function (err) {
				console.error('WEBPACK ERROR', err);
				this.emit('end');
			})
			.pipe(dest(`${buildFolder}/js/`))
			.pipe(browsersync.stream())

			.pipe(src(LibsJsFiles))
			.pipe(gulpif(isDev, changed(`${buildFolder}/js/`, { extension: '.js' })))
			.pipe(gulpif(isBuild, terser()))
			.pipe(dest(`${buildFolder}/js/`))
			.pipe(browsersync.stream())
	);
}

/* ____________________________________________ */
// Watch files

function watchFiles() {
	watch(`${srcFolder}/**/*.html`, html);
	watch(`${srcFolder}/**/*.{scss,sass}`, css);
	watch(`${srcFolder}/**/*.{js,ts}`, js);
	watch(`${srcFolder}/img/**/*.{png,ico,gif,svg,webmanifest,json}`, img);
	watch(`${srcFolder}/img/**/*.{png,jpg,jpeg,webp}`, webp);
	watch(`${srcFolder}/assets/font/**/*.{otf,ttf,woff,woff2,svg}`, font);
}

// BrowserSync

function browserSync() {
	browsersync.init({
		server: { baseDir: `${buildFolder}` },
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
