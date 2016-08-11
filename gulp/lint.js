// Modules required for this task
var 
    gulpDebug = require('gulp-debug'),
    gulp = require('gulp'),
    gulpDebug = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    eslint = require('gulp-eslint'),
    lesshint = require('gulp-lesshint');

gulp.task('eslint', function() {
  return gulp.src('assets/**/*.js')
    .pipe(eslint())
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
