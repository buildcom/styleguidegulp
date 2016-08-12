'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    hologram = require('gulp-hologram');

var paths = {
    shared: {
        src: './Source/Shared'
    },
    ca: {
        src: './Source/CA',
        work: './Working/CA',
        holo: './hologram_config_ca.yml'
    },
    keg: {
        src: './Source/Keg',
        work: './Working/Keg',
        holo: './hologram_config_keg.yml'
    }
}

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

//Build CA
gulp.task('caholo', ['copyca'], function() {
    //Build the CSS from the working directory
    gulp.src( paths.ca.holo )
    .pipe( hologram({logging:true}) );
});

//Copy all necessary CA files to the working directory
gulp.task('copyca', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.ca.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.ca.work ) )
        .pipe(sass().on('error', sass.logError))
});

//Sass Compile for CA
gulp.task('styles', function() {
    gulp.src('Source/CA/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('Destination/CA/'))
});

//Build Keg
gulp.task('kegholo', ['copykeg'], function() {
    //Build the CSS from the working directory
    gulp.src( paths.keg.holo )
        .pipe( hologram({logging:true}) );
});

//Copy all necessary Keg files to the working directory
gulp.task('copykeg', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.keg.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.keg.work ) )
});

//Sass Compile for Keg
gulp.task('styles', function() {
    gulp.src('Source/Keg/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('Destination/Keg/'))
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( paths.shared.src, ['caholo','kegholo']);
    gulp.watch( paths.ca.src, ['caholo']);
    gulp.watch( paths.keg.src, ['kegholo']);
    gulp.watch('Source/**/*.scss',['styles']);
});

//default task that runs with command 'gulp' and calls other tasks specified
gulp.task('default', function() {
    gulp.start('caholo','kegholo');
});