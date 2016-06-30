// Modules required for this task
var gulp = require('gulp'),
    jade = require('gulp-jade');

// Define main directories
var assets = 'assets/app/';

// Run Bower and download dependencies
gulp.task('jade2html', function() {
  gulp.src(assets + '**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(assets))
});
