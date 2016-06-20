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

// Copy the entire States, Features and Shared folders, but without .less files (they are already)
// imported in the app.min.css
gulp.task('angularStates', ['bower', 'jade2html'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'states/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'states'))
});

gulp.task('angularFeatures', ['bower', 'jade2html'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'features/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'features'))
});

gulp.task('angularShared', ['bower'], function() {
  var excludeLess = filter(['**/*.*', '!**/*.less']);
  return gulp.src(assets + 'shared/**/*.*')
    .pipe(excludeLess)
    .pipe(gulp.dest(destination + 'shared'))
});
