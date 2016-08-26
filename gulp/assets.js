// Modules required for this task
var gulp = require('gulp'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    lessImport = require('gulp-less-import'),
    gulpDebug = require('gulp-debug');

// Define main directories
var assets = 'assets/',
    destination = 'public/';
    // production = environments.production;

// Preprocess CSS and minify it
gulp.task('less', function () {
    return gulp.src(assets + '**/*.less')
        .pipe(gulpDebug())
        .pipe(lessImport('app.less'))
        .pipe(less({ paths: [assets + 'content/less', assets + 'app/features']}))
        // - tasks only for production env = NODE_ENV=production gulp
        // .pipe(production(rename({suffix: '.min'})))
        // .pipe(production(minifyCss()))
        // -
        .pipe(gulp.dest(destination + 'css'));
});

// Images optimization
gulp.task('images', function() {
    return gulp.src(assets + 'content/images/**/*')
        .pipe(gulpDebug())
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(destination + 'images'));
});
