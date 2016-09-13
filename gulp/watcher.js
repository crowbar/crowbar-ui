// Modules required for this task
var gulp = require('gulp'),
    environments = require('gulp-environments');

// Define main directories
var assets = 'assets/',
    development = environments.development,
    excludeTests = '!' + assets + '**/*.spec.js';

// Watch for changes in our custom assets
gulp.task('watch', function () {
    // watch only if in development ENV
    if (development()) {
        // Watch .js files
        gulp.watch(
            [
                assets + 'app/*.js',
                excludeTests
            ],
            ['app']
        );
        gulp.watch(
            [
                assets + 'app/core/**/*.js',
                excludeTests
            ],
            ['angularCore']
        );
        gulp.watch(
            [
                assets + 'app/features/**/*.+(js|json)',
                excludeTests
            ],
            ['angularFeatures']
        );
        gulp.watch(
            [
                assets + 'app/widgets/**/*.+(js|json)',
                excludeTests
            ],
            ['angularWidgets']
        );
        gulp.watch(
            [
                assets + 'app/data/**/*.js',
                excludeTests
            ],
            ['angularData']
        );

        // Watch .css files
        gulp.watch(assets + '**/*.less', ['less']);
        // Watch image files
        gulp.watch(assets + 'content/images/**/*', ['images']);
        // Watch the Jade files in the Assets folder
        gulp.watch(assets + '**/*.jade', ['templateCache']);
    }
});
