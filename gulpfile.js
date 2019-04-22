/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/
var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    wrap = require('gulp-wrap'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-cssnano'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-htmlmin');

// const mainBowerFiles = require('gulp-main-bower-files');
const mainBowerFiles = require('main-bower-files');

const gulpFilter = require('gulp-filter');
const del        = require('del');
const fs          = require('fs');

var paths = {
    js: 'src/js/',
    scripts: [
        'src/js/module.js',
        'src/js/modules/*.js',
        'src/js/**/*.js'

    ],
    // scripts: 'src/js/**/*.*',
    styles: 'src/less/**/*.*',
    images: 'src/img/**/*.*',
    templates: 'src/templates/**/*.html',
    index: 'src/index.html',
    bower_fonts: 'src/bower_components/**/*.{ttf,woff,woff2,eot,svg}',
    bower_components: 'src/bower_components',
    bower_scripts: 'src/bower_components/**/_.min.js',
    bower_styles: 'src/bower_components/__/_.min.css'
};

var build = {
    js: 'dist/js'
}


/**
 *  get Url config from Environment variable
 */
gulp.task('config', function(){
});


/**
 * Handle bower components from index
 */
gulp.task('usemin', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat'],
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('concat-bower-js', function() {

    var jsFilter = gulpFilter('**/*.js')
    return gulp.src(mainBowerFiles(), {base: paths.bower_components})
        .pipe(jsFilter)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('dist/lib/js'))
});

gulp.task('concat-bower-css', function() {
    var cssFilter = gulpFilter('**/*.css')
    return gulp.src(mainBowerFiles(), {base: paths.bower_components})
        .pipe(cssFilter)
        .pipe(concat('vendor-bower.min.css'))
        .pipe(gulp.dest('dist/lib/css'))
});

gulp.task('bower', ['concat-bower-js', 'concat-bower-css']);


/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function() {
    return gulp.src(paths.bower_fonts)
        .pipe(rename({
            dirname: '/fonts'
        }))
        .pipe(gulp.dest('dist/lib'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['config', 'bower', 'custom-images', 'custom-js', 'custom-less', 'custom-templates', 'usemin']);

gulp.task('custom-images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});

gulp.task('custom-js', function() {
    return gulp.src(paths.scripts)
        // .pipe(minifyJs())
        .pipe(concat('dashboard.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('custom-less', function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('custom-templates', function() {
    return gulp.src(paths.templates)
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist/templates'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function() {
    gulp.watch([paths.images], ['custom-images']);
    gulp.watch([paths.styles], ['custom-less']);
    gulp.watch([paths.scripts], ['custom-js']);
    gulp.watch([paths.templates], ['custom-templates']);
    gulp.watch([paths.index], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 5000
    });
});

gulp.task('livereload', function() {
    gulp.src(['dist/**/*.*'])
        .pipe(watch(['dist/**/*.*']))
        .pipe(connect.reload());
});

/**
 * Gulp tasks
 */
gulp.task('build', ['build-assets', 'build-custom']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
