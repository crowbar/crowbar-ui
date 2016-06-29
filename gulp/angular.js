// Modules required for this task
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    path = require('path'),
    filter = require('gulp-filter'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    lessImport = require('gulp-less-import'),
    gulpDebug = require('gulp-debug');

// Define main directories
var assets = 'assets/',
    destination = 'public/';

// Concatenate & Minify propietary JS
gulp.task('app', function() {
  return gulp.src([assets + 'app/*.js'])
    .pipe(gulpDebug())
    // - tasks only for production env = NODE_ENV=production gulp
    // .pipe(production(concat('main.js')))
    // .pipe(production(rename({suffix: '.min'})))
    // .pipe(production(uglify()))
    // -
    .pipe(gulp.dest(destination + 'app'));
});

// Copy the entire States, Features and Shared folders, but without .less files (they are already)
// imported in the app.min.css
gulp.task('angularWidgets', ['bower', 'jade2html'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'app/widgets/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'app/widgets'))
});

gulp.task('angularFeatures', ['bower', 'jade2html'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'app/features/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'app/features'))
});

gulp.task('angularData', ['bower'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'app/data/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'app/data'))
});

gulp.task('angularCore', ['bower'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'app/core/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'app/core'))
});
