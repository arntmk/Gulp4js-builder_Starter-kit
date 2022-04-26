const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins

const sass = require("gulp-sass")(require("sass")); //препроцесор css.
const autoprefixer = require("gulp-autoprefixer"); //Добавлення префіксів для сумісності.
const concat = require("gulp-concat"); //Переіменування та обєднаття.
const fileinclude = require("gulp-file-include"); //Створення категорій для html.
const htmlmin = require("gulp-htmlmin"); //Мінімізація.
const browsersync = require("browser-sync").create(); //Сервер.
const imagemin = require("gulp-imagemin"); //Оптимізація картинок.
const clean = require("gulp-clean"); //Видалення.
const webp = require("gulp-webp"); //Конвертатор.
const webpHTML = require("gulp-webp-html-fixed"); //Авто сумісность html.
const webpCSS = require("gulp-webp-css-fixed"); // Авто сумісность css.
const newer = require("gulp-newer"); //Перевірка оновлень.
const terser = require("gulp-terser"); //Мінімізація js.
const plumber = require("gulp-plumber"); //Пошук помилок.
const fonter = require("gulp-fonter"); //Конвертатор шрифтів.
const ttf2woff2 = require("gulp-ttf2woff2"); //Конвертатор woff2.
const gulpif = require("gulp-if"); //Обмеження dev or production.
const babel = require("gulp-babel"); //Підтримка старих версій js.
const typograf = require("gulp-typograf"); //Правопис.
const ts = require("gulp-typescript"); //Підтримка typescript.
const vn = require("gulp-version-number"); //build version.
const groupCSSMedia = require("gulp-group-css-media-queries"); //Групування медія запросів.
const svgmin = require("gulp-svgmin"); //Мінімізація svg.
const cheerio = require("gulp-cheerio"); //видалення лишніх атрибутів.
const replace = require("gulp-replace"); //заміна деяких багів після gulp-cheerio.
const svgSprite = require("gulp-svg-sprite"); //Об'єднує спрайти.

// Pproduction build

const isBuild = process.argv.includes("--production");
const isDev = !isBuild;

// Cleaner

function clear() {
	return src("build/*", { read: false }).pipe(clean());
}

// CSS

function scss() {
	const cssSrc = "src/scss/**/*.{scss,sass}";
	return src(cssSrc, { sourcemaps: isDev })
		.pipe(plumber())
		.pipe(gulpif(isDev, sass())) // Options: nested, expanded, compact, compressed.
		.pipe(gulpif(isBuild, sass({ outputStyle: "compressed" })))
		.pipe(webpCSS())
		.pipe(groupCSSMedia())
		.pipe(autoprefixer({ grid: true }))
		.pipe(concat("main.min.css"))
		.pipe(dest("build/css/", { sourcemaps: isDev }))
		.pipe(browsersync.stream());
}

// Optimize images

function img() {
	const imgSrc = "src/img/**/*.{png,jpg,jpeg,gif,svg,ico,webp}";
	return src(imgSrc)
		.pipe(newer("build/img/"))
		.pipe(webp())
		.pipe(dest("build/img/"))
		.pipe(src(imgSrc))
		.pipe(
			gulpif(
				isBuild,
				imagemin({
					progressive: true,
					plugins: [{ removeViewBox: true }],
					interlaced: true,
					optimizationLevel: 3, //0 to 7
				})
			)
		)
		.pipe(dest("build/img/"));
}

// Fonts

function font() {
	const fontSrc = "src/fonts/**/*.{ttf,otf}";
	return src(fontSrc)
		.pipe(newer("build/fonts/"))
		.pipe(fonter({ formats: ["woff", "eot", "ttf"] }))
		.pipe(dest("build/fonts/"))
		.pipe(ttf2woff2())
		.pipe(dest("build/fonts/"));
}

// Svg Sprite

function Svg() {
	const SvgSrc = "src/img/svg/*.svg";
	return src(SvgSrc)
		.pipe(svgmin({ js2svg: { pretty: true } }))
		.pipe(
			cheerio({
				run: function ($) {
					$("file").removeAttr("file");
					$("stroke").removeAttr("stroke");
					$("style").removeAttr("style");
				},
				parserOptions: { xmlMode: true },
			})
		)
		.pipe(replace("&gt;", ">"))
		.pipe(
			svgSprite({
				mode: { symbol: { sprite: "sprite.svg", example: true } },
			})
		)
		.pipe(dest("build/img/svg/"));
}

// html

function html() {
	return src("src/*.html")
		.pipe(plumber())
		.pipe(fileinclude({ prefix: "@@" }))
		.pipe(webpHTML())
		.pipe(typograf({ locale: ["ru", "en-US"] }))
		.pipe(
			gulpif(
				isBuild,
				vn({
					value: "%DT%",
					append: { key: "_v", cover: 0, to: ["css", "js"] },
				})
			)
		)
		.pipe(htmlmin({ removeComments: isBuild, collapseWhitespace: isBuild }))
		.pipe(dest("build/"))
		.pipe(browsersync.stream());
}

// JavaScript

function js() {
	return src(["src/js/**/*.{js,ts,jsx,vue}"], { sourcemaps: isDev })
		.pipe(plumber())
		.pipe(ts({ noImplicitAny: true, outFile: "main.min.js" }))
		.pipe(babel({ presets: ["@babel/preset-env"] }))
		.pipe(gulpif(isBuild, terser()))
		.pipe(concat("main.min.js"))
		.pipe(dest("build/js", { sourcemaps: isDev }))
		.pipe(browsersync.stream());
}

// Watch files

function watchFiles() {
	watch("src/scss/**/*.{scss,sass}", scss);
	watch("src/**/*.html", html);
	watch("src/img/**/*.{png,jpg,jpeg,gif,svg,ico,webp}", img);
	watch("src/fonts/**/*.{woff,woff2,eot,ttf,otf,otc,ttc,svg}", font);
	watch("src/js/**/*.{js,ts,jsx,vue}", js);
}

// BrowserSync

function browserSync() {
	browsersync.init({
		server: { baseDir: "build/" },
		notify: false,
		online: true,
		port: 3015,
	});
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(html, scss, img, js, font));
exports.svg = Svg;
