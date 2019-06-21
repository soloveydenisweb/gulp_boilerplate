var gulp = require("gulp"),
	sass = require("gulp-sass"),
	pug = require("gulp-pug");
	beautifyCode = require("gulp-beautify-code");
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssnano = require("cssnano"),
	sourcemaps = require("gulp-sourcemaps"),
	imagemin = require("gulp-imagemin"),
	minify = require("gulp-minify"),
	concat = require("gulp-concat"),
  babel = require("gulp-babel"),
	browserSync = require("browser-sync").create();

var paths = {
	styles: {
		src: "src/sass/*.sass",
		dest: "dist/css"
	},
	views: {
		src: "src/views/*.pug",
		dest: "src/html"
	},
	beautify: {
		src: "src/html/*.html",
		dest: "dist/"
	},
	scripts: {
		src: "src/js/*.js",
		dest: "dist/js"
	},
	images: {
		src: "src/img/*",
		dest: "dist/img/"
	},
	favs: {
		src: "src/favicons/*",
		dest: "dist/favicons"
	},
	fonts: {
		src: "src/fonts/*",
		dest: "dist/fonts"
	}
};

function style() {
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(postcss([autoprefixer({
			cascade: false,
			grid: 'autoplace'
		}), cssnano()]))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

function views() {
	return gulp
		.src(paths.views.src)
		.pipe(pug())
		.pipe(gulp.dest(paths.views.dest))
		.pipe(browserSync.stream());
}

function beautify() {
	return gulp
		.src(paths.beautify.src)
		.pipe(beautifyCode({
			indent_size: 2,
			indent_char: ' ',
			unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
		}))
		.pipe(gulp.dest(paths.beautify.dest))
		.pipe(browserSync.stream());
}

function images() {
	return gulp
		.src(paths.images.src)
		.pipe(imagemin([
			imagemin.gifsicle({
				interlaced: true
			}),
			imagemin.jpegtran({
				progressive: true
			}),
			imagemin.optipng({
				optimizationLevel: 5
			}),
			imagemin.svgo({
				plugins: [{
						removeViewBox: true
					},
					{
						cleanupIDs: false
					}
				]
			})
		]))
		.pipe(gulp.dest(paths.images.dest))
		.pipe(browserSync.stream());
}

function scripts() {
	return gulp
	.src(paths.scripts.src)
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(concat("scripts.js"))
	.pipe(minify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(paths.scripts.dest))
	.pipe(browserSync.stream());
}

function copyFavs() {
  return gulp
    .src(paths.favs.src)
    .pipe(gulp.dest(paths.favs.dest))
	  .pipe(browserSync.stream());
}

function copyFonts() {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
	  .pipe(browserSync.stream());
}

function reload() {
	browserSync.reload();
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	gulp.watch(paths.styles.src, style);
	gulp.watch(paths.views.src, views);
	gulp.watch(paths.beautify.src, beautify);
	gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.favs.src, copyFavs);
  gulp.watch(paths.fonts.src, copyFonts);

	gulp.watch("dist/*.html").on('change', browserSync.reload);
}

exports.watch = watch

exports.style = style;
exports.views = views;
exports.beautify = beautify;
exports.images = images;
exports.scripts = scripts;
exports.copyFavs = copyFavs;
exports.copyFonts = copyFonts;

var build = gulp.parallel(style, views, beautify, images, scripts, copyFavs, copyFonts, watch);

gulp.task('build', build);

gulp.task('default', build);