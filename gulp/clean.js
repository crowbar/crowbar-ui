// Modules required for this task
var gulp = require('gulp'),
    clean = require('gulp-clean'),

// Define main directories
    destination = 'public/';

// Clean the built files to start a fresh building
gulp.task('clean', function () {
    return gulp.src(destination, {read: false})
        .pipe(clean());
});
