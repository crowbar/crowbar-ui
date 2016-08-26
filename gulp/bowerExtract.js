// Modules required for this task
var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),

    // Define main directories
    destination = 'public/',
    vendors = 'bower_components/',

    // Get JS files from the 'main' property in each bower.json from the Vendors/
    // folder and minify into one file
    jsFilter = filter('**/*.js'),
    cssFilter = filter('**/*.css'),
    fontFilter = filter('**/*.{otf,eot,svg,ttf,woff,woff2}');

gulp.task('jsBowerExtract', ['bower'], function() {
    return gulp.src(
        mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js'
                    ]
                },
                bardjs: {
                    main: []
                }
            },
            includeDev: true
        }),
        {
            base: vendors
        })
        .pipe(jsFilter)
        .pipe(concat('bower_components.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest(destination + 'js'))
});

// Get CSS files from Main in each bower.json from Vendors/ and minify it
gulp.task('cssBowerExtract', ['bower'], function() {
    return gulp.src(
        mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/css/*.min.*'
                    ]
                },
                'font-awesome': {
                    'main': [
                        './css/*.min.*'
                    ]
                }
            }
        }),
        {
            base: vendors
        })
        .pipe(cssFilter)
        .pipe(concat('bower_components.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss())
        .pipe(gulp.dest(destination + 'css'));
});

gulp.task('fontsBowerExtract', function() {
    return gulp.src(
        mainBowerFiles({
            overrides: {
                'font-awesome': {
                    'main': [
                        'fonts/**.*'
                    ]
                },
                'bootstrap': {
                    'main': [
                        'fonts/**.*'
                    ]
                }
            }
        })
    )
        .pipe(fontFilter)
        .pipe(gulp.dest(destination + 'fonts'));
});
