var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gulp_react = require('gulp-react'),
    stylus = require('gulp-stylus');

gulp.task('stylus', function() {
    gulp.src('./**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});

gulp.task('compile-jsx', function() {
    gulp.src('./**/*.jsx')
        .pipe(gulp_react())
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});

gulp.task('browserify-account', function() {
    return browserify('./account/js/app.js')
        .bundle()
        .pipe(source('account.js'))
        .pipe(gulp.dest('./js/'));
})



gulp.task('default', function() {
    gulp.watch('./**/*.styl', ['stylus']);
    gulp.watch('./**/*.jsx', ['compile-jsx']);
    gulp.watch('./account/js/*.js', ['browserify-account']);
});
