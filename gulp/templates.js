// Modules required for this task
var gulp = require('gulp'),
    templateCache = require('gulp-angular-templatecache'),
    jade = require('gulp-jade'),

// Define main directories
    assets = 'assets/app/',
    destination = 'public/app';

gulp.task('templateCache', function () {
    return gulp.src(assets + '**/*.jade')
        .pipe(jade())
        .pipe(templateCache('crowbar-app.templates.js', {module: 'crowbarApp', root: 'app/'}))
        .pipe(gulp.dest(destination));
});
