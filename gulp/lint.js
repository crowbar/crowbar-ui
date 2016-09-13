// Modules required for this task
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    lesshint = require('gulp-lesshint'),
    runSequence = require('run-sequence');

gulp.task('eslint', function(callback) {
    runSequence(
        'eslint-node',
        'eslint-angular',
        callback
    );
});

gulp.task('eslint-angular', function () {
    return gulp.src(['assets/**/*.js'])
        .pipe(eslint({
            configFile: '.eslintrc.angular.js'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('eslint-node', function () {
    return gulp.src([
        '+(gulp|routes|bin)/**/*.js',
        '*.js'
    ])
        .pipe(eslint({
            configFile: '.eslintrc.node.js'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task('lesslint', function() {
    return gulp.src('assets/**/*.less')
        .pipe(lesshint({
            // Options 
            // configPath: ""
        }))
        .pipe(lesshint.reporter());
});
