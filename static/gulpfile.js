var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gulpReact = require('gulp-react'),
    runSequence = require('run-sequence'),
    babel = require('gulp-babel'),
    stylus = require('gulp-stylus');

gulp.task('stylus', function () {
    gulp.src('./**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('compile-jsx', function () {
    gulp.src('./account/js/*.jsx')
        .pipe(gulpReact())
        .pipe(babel())
        .pipe(gulp.dest('./js/'));
});

gulp.task('babel', function () {
    gulp.src('./account/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./js/'));
});

gulp.task('browserify', function () {
    return browserify('./js/app.js')
        .bundle()
        .pipe(source('account.js'))
        .pipe(gulp.dest('./js/'));
});

gulp.task('general-for-jsx', function() {
    runSequence(
        'compile-jsx',
        'babel',
        'browserify'
    );
});

gulp.task('default', function () {
    gulp.watch('./**/*.styl', ['stylus']);
    gulp.watch('./account/js/*.jsx', ['general-for-jsx']);
});
