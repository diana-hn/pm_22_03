const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');

function HTML() {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'));

};

function buildStyles() {
    return gulp.src('src/scss/main.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest('dist/css'));
}

function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

function images() {
    return gulp.src('src/imgs/**/*', {encoding: false})
        .pipe(plumber())
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

    gulp.watch('src/**/*.html', gulp.series(HTML, reload));
    gulp.watch('src/scss/**/*.scss', gulp.series(buildStyles, reload));
    gulp.watch('src/js/**/*.js', gulp.series(scripts, reload));
    gulp.watch('src/imgs/**/*', gulp.series(images, reload));
    gulp.watch('src/fonts/*.*', gulp.series(fonts, reload));
}

function bootstrapCss() {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(plumber())
        .pipe(gulp.dest('dist/css'));
}

function bootstrapJs() {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(plumber())
        .pipe(gulp.dest('dist/js'));
}

exports.default = gulp.series(
    gulp.parallel(HTML, buildStyles, scripts, images, fonts, bootstrapCss, bootstrapJs),
    watchFiles
);

function fonts() {
    return gulp.src('src/fonts/*.*', {encoding: false}) // Додали цей параметр
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));
}