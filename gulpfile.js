// Include gulp
var gulp = require('gulp'),
    runSequence = require('run-sequence');

// The require-dir module will automatically include all the files in under the
// gulp/ folder and require() all the modules in this file
var requireDir = require('require-dir');
requireDir('./gulp');

//Lints
gulp.task('lints', function (callback) {
    runSequence('eslint', 'lesslint', callback);
});

// Build
gulp.task('build', function (callback) {
    runSequence(
        'bower',
        [
            'jsBowerExtract',
            'cssBowerExtract',
            'fontsBowerExtract',
            'app',
            'less',
            'images',
            'angularCore',
            'angularWidgets',
            'angularFeatures',
            'angularData',
            'templateCache'
        ],
        callback
    );
});

// Default task
gulp.task('default', function (callback) {
    runSequence(
        'clean',
        'build',
        'watch',
        callback
    );
});
