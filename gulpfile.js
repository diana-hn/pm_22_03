const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

    function HTML() {
        return gulp.src('src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'));

};

function buildStyles() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
};

function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

function images() {
    return gulp.src('src/imgs/**/*',{ encoding: false })
        .pipe(gulp.dest('dist/imgs'));
}

function reload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/*.html', gulp.series(HTML, reload));
    gulp.watch('src/scss/**/*.scss', gulp.series(buildStyles, reload));
    gulp.watch('src/js/**/*.js', gulp.series(scripts, reload));
    gulp.watch('src/imgs/**/*', gulp.series(images, reload));
}

function bootstrapCss() {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'));
}

function bootstrapJs() {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('dist/js'));
}

exports.default = gulp.series(
    gulp.parallel(HTML, buildStyles, scripts, images, bootstrapCss, bootstrapJs),
    watchFiles
);
