// Modules required for this task
var gulp = require('gulp'),
    bower = require('gulp-bower');

// Define main directories
var vendors = 'bower_components/';

// Run Bower and download dependencies
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(vendors));
});
