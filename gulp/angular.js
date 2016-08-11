// Modules required for this task
var gulp = require('gulp'),
    gulpDebug = require('gulp-debug'),

// Define main directories
    assets = 'assets/',
    destination = 'public/',
    exclude = [
        '!' + assets + '**/*.spec.js',
        '!**/*.less'
    ];

// Concatenate & Minify propietary JS
gulp.task('app', function () {
    return gulp.src([assets + 'app/*.js'].concat(exclude))
        .pipe(gulpDebug())
        .pipe(gulp.dest(destination + 'app'));
});

// Copy the entire States, Features and Shared folders, but without .less files (they are already)
// imported in the app.min.css
gulp.task('angularWidgets', ['bower', 'jade2html'], function () {
    return gulp.src([assets + 'app/widgets/**/*.*'].concat(exclude))
        .pipe(gulp.dest(destination + 'app/widgets'));
});

gulp.task('angularFeatures', ['bower', 'jade2html'], function () {
    return gulp.src([assets + 'app/features/**/*.*'].concat(exclude))
        .pipe(gulp.dest(destination + 'app/features'));
});

gulp.task('angularData', ['bower'], function () {
    return gulp.src([assets + 'app/data/**/*.*'].concat(exclude))
        .pipe(gulp.dest(destination + 'app/data'));
});

gulp.task('angularCore', ['bower'], function () {
    return gulp.src([assets + 'app/core/**/*.*'].concat(exclude))
        .pipe(gulp.dest(destination + 'app/core'));
});
