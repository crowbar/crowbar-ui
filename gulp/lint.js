// Modules required for this task
var gulp = require('gulp'),
    gulpDebug = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    lesshint = require('gulp-lesshint');

gulp.task('jslint', function() {
  return gulp.src('assets/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('lesslint', function() {
    return gulp.src('assets/**/*.less')
        .pipe(lesshint({
            // Options 
            // configPath: ""
        }))
        .pipe(lesshint.reporter());
});
