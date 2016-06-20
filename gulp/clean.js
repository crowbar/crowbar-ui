// Modules required for this task
var gulp = require('gulp'),
    clean = require('gulp-clean');

// Define main directories
var destination = 'public/',
    assets = 'assets/';

// Clean the built files to start a fresh building
gulp.task('clean', function () {
  return gulp.src(destination, {read: false})
    .pipe(clean());
});

// Clean the built files to start a fresh building
gulp.task('cleanAssetsHtml', ['angularStates', 'angularFeatures', 'angularShared'], function () {
  return gulp.src(assets + '**/*.html', {read: false})
    .pipe(clean());
});
