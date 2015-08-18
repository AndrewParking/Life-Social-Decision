var gulp = require('gulp'),
    stylus = require('gulp-stylus');

gulp.task('stylus', function() {
    gulp.src('./**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(function(file) {
            console.log('here');
            return file.base;
        }))
});

gulp.task('default', function() {
    gulp.watch('./**/*.styl', ['stylus']);
});
