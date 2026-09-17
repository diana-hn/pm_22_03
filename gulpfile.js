const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

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

async function images() {
    const imagemin = (await import('gulp-imagemin')).default;
    return gulp.src('src/imgs/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/imgs'));
}

function watchFiles() {
    browserSync.init({
        server: { baseDir: './dist' }
    });

    gulp.watch('src/*.html', HTML).on('change', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', buildStyles).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', scripts).on('change', browserSync.reload);
    gulp.watch('src/imgs/**/*', images).on('change', browserSync.reload);
}

exports.default = gulp.series(
    gulp.parallel(HTML, buildStyles, scripts, images),
    watchFiles
);

