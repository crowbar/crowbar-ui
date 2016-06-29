// Include gulp
var gulp = require('gulp');

// The require-dir module will automatically include all the files in under the
// gulp/ folder and require() all the modules in this file
var requireDir = require('require-dir'),
    dir = requireDir('./gulp');

// Build
gulp.task('build', ['jsBowerExtract', 'cssBowerExtract', 'fontsBowerExtract', 'app', 'less', 'images', 'angularCore', 'angularWidgets', 'angularFeatures', 'angularData', 'watch', 'cleanAssetsHtml']);

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
