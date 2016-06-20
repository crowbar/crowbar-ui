// Modules required for this task
var gulp = require('gulp'),
    environments = require('gulp-environments');

// Define main directories
var assets = 'assets/',
    development = environments.development;

// Watch for changes in our custom assets
gulp.task('watch', function() {
  // watch only if in development ENV
  if (development()) {
    // Watch .js files
    gulp.watch(assets + 'js/*.js', ['js']);
    // Watch .css files
    gulp.watch(assets + '**/*.less', ['less']);
    // Watch image files
    gulp.watch(assets + 'images/**/*', ['images']);
    // Watch the Jade files in the Assets folder
    gulp.watch(assets + '**/*.jade', ['cleanAssetsHtml']);
  }
});
