// Modules required for this task
var gulp = require('gulp'),
    templateCache = require('gulp-angular-templatecache'),

// Define main directories
    assets = 'assets/app/',
    destination = 'public/';

gulp.task('templateCache', ['angularFeatures', 'angularWidgets'], function () {
    return gulp.src(assets + '**/*.html')
        .pipe(templateCache('templates.js', {module: 'crowbarTemplates', root: 'app/'}))
        .pipe(gulp.dest(destination + 'app'));
});
