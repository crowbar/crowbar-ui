var gulp = require('gulp');

gulp.task('lint', function () {
    var eslint = require('gulp-eslint');

    return gulp.src(['./*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
    var mocha = require('gulp-mocha');

    return gulp.src(['./test.js'])
        .pipe(mocha());
});

gulp.task('default', ['test']);
