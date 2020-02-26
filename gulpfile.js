const {src, dest, parallel, watch, series} = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const newer = require("gulp-newer");
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require("gulp-imagemin");
// BrowserSync
function browsersync(done) {
	browserSync.init({
		server: {
			baseDir: './app'
		},
		port: 3009
	});
}
function browsersyncReload(done) {
	reload();
	done();
}
//gulp task
function css() {
	return src("scss/style.scss")
	.pipe(autoprefixer())
	.pipe(sass().on('error', sass.logError))
	.pipe(minifyCSS())
	.pipe(dest("app/css"))
	.pipe(browserSync.stream());
};
function images() {
	return src("img/*.jpg")
	.pipe(newer("./app/img"))
	.pipe(imagemin([
		imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
	.pipe(dest('./app/img'));
}
function watchFiles() {
	watch('scss/*.scss', css);
	watch('img/*', images);
	watch(['./app'], browsersyncReload)
}

// Defaud Gulp Task
function defaultTask(cb) {
	console.log("It's working");
	cb();
}
// define complex task
const build = parallel(css, defaultTask);
const watchT = parallel(watchFiles, browsersync);

exports.defaultTask = defaultTask;
exports.css = css;
exports.build = build;
exports.images = images;
exports.watchT = watchT;
exports.default = build;
