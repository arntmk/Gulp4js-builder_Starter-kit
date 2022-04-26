const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins

const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const fileinclude = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const browsersync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");
const webp = require("gulp-webp");
const webpHTML = require("gulp-webp-html-fixed");
const webpCSS = require("gulp-webp-css-fixed");
const newer = require("gulp-newer");
const terser = require("gulp-terser");
const plumber = require("gulp-plumber");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const gulpif = require("gulp-if");
const babel = require("gulp-babel");
const typograf = require("gulp-typograf");
const ts = require("gulp-typescript");

// Pproduction build

const isBuild = process.argv.includes("--production");
const isDev = !isBuild;

// Cleaner

function clear() {
	return src("build/*", { read: false }).pipe(clean());
}

// CSS

function scss() {
	const cssSrc = "src/scss/**/*.{scss, sass}";
	return src(cssSrc, { sourcemaps: isDev })
		.pipe(plumber())
		.pipe(gulpif(isDev, sass())) // Options: nested, expanded, compact, compressed.
		.pipe(gulpif(isBuild, sass({ outputStyle: "compressed" })))
		.pipe(webpCSS())
		.pipe(autoprefixer({ grid: true }))
		.pipe(concat("main.min.css"))
		.pipe(dest("build/css/", { sourcemaps: isDev }))
		.pipe(browsersync.stream());
}

// Optimize images

function img() {
	const imgSrc = "src/img/**/*.{png, jpg, jpeg, gif, svg, ico, webp}";
	return src(imgSrc)
		.pipe(newer("build/img/"))
		.pipe(webp())
		.pipe(dest("build/img/"))
		.pipe(src(imgSrc))
		.pipe(gulpif(isBuild, imagemin()))
		.pipe(dest("build/img/"));
}

// Fonts

function font() {
	const fontSrc = "src/fonts/**/*.{woff,woff2,eot,ttf,otf,otc,ttc,svg}";
	return src(fontSrc)
		.pipe(newer("build/fonts/"))
		.pipe(fonter({ formats: ["woff", "eot", "ttf", "svg"] }))
		.pipe(dest("build/fonts/"))
		.pipe(ttf2woff2())
		.pipe(dest("build/fonts/"));
}

// html

function html() {
	return src("src/*.html")
		.pipe(plumber())
		.pipe(fileinclude({ prefix: "@@" }))
		.pipe(webpHTML())
		.pipe(typograf({ locale: ["ru", "en-US"] }))
		.pipe(htmlmin({ removeComments: isBuild, collapseWhitespace: isBuild }))
		.pipe(dest("build/"))
		.pipe(browsersync.stream());
}

// JavaScript

function js() {
	return src(["src/js/**/*.*"], { sourcemaps: isDev })
		.pipe(newer("build/js/main.min.js"))
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
	watch("src/scss/**/*.{scss, sass}", scss);
	watch("src/**/*.html", html);
	watch("src/img/**/*.{png, jpg, jpeg, gif, svg, ico, webp}", img);
	watch("src/fonts/**/*.{woff,woff2,eot,ttf,otf,otc,ttc,svg}", font);
	watch("src/js/**/*.*", js);
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
