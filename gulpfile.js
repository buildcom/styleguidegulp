'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    hologram = require('gulp-hologram'),
    bs = require('browser-sync').create(),
    reload = bs.reload;

var paths = {
    shared: {
        src: './Source/Shared'
    },
    aa: {
        src: './Source/AAA',
        work: './Working/AAA',
        holo: './hologram_config_aa.yml'
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
    },
    ld: {
        src: './Source/LD',
        work: './Working/LD',
        holo: './hologram_config_ld.yml'
    },
    wcd: {
        src: './Source/WCD',
        work: './Working/WCD',
        holo: './hologram_config_wcd.yml'
    }        
}

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

// BUILD AAA ==========================================
gulp.task('aaholo', ['copyaa'], function() {
    // Build the CSS from the working directory
    gulp.src( paths.aa.holo )
    .pipe(hologram({logging:true}));
});

// Copy all necessary AAA files to the working directory
gulp.task('copyaa', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.aa.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.aa.work ) )
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Destination/AAA'))
        .pipe(bs.stream());
});

// BUILD CA ==========================================
gulp.task('caholo', ['copyca'], function() {
    // Build the CSS from the working directory
    gulp.src( paths.ca.holo )
    .pipe(hologram({logging:true}));
});

// Copy all necessary CA files to the working directory
gulp.task('copyca', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.ca.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.ca.work ) )
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Destination/CA'))
        .pipe(bs.stream());
});

// BUILD KEG ==========================================
gulp.task('kegholo', ['copykeg'], function() {
    //Build the CSS from the working directory  
    gulp.src( paths.keg.holo )
    .pipe(hologram({logging:true}));
});

//Copy all necessary Keg files to the working directory
gulp.task('copykeg', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.keg.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.keg.work ) )
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Destination/Keg'))
        .pipe(bs.stream());        
});

// BUILD LD ==========================================
gulp.task('ldholo', ['copyld'], function() {
    // Build the CSS from the working directory  
    gulp.src( paths.ld.holo )
    .pipe(hologram({logging:true}));
});

// Copy all necessary LD files to the working directory
gulp.task('copyld', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.ld.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.ld.work ) )
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Destination/LD'))
        .pipe(bs.stream());
});

// BUILD WCD ==========================================
gulp.task('wcdholo', ['copywcd'], function() {
    // Build the CSS from the working directory  
    gulp.src( paths.wcd.holo )
    .pipe(hologram({logging:true}));
});

// Copy all necessary WCD files to the working directory
gulp.task('copywcd', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.wcd.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.wcd.work ) )
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Destination/WCD'))
        .pipe(bs.stream());
});

// SERVE FILES => BROWSERSYNC ==========================================
gulp.task('serve', ['aaholo','caholo','kegholo','ldholo','wcdholo'], function () {
    // Serve files from the Destinaion folder
    bs.init({
        server: {
            baseDir: "Destination",
            directory: true
        }
    });

    gulp.watch( paths.shared.src + '/*', ['aaholo','caholo','kegholo','ldholo','wcdholo']);
    gulp.watch( paths.aa.src     + '/*', ['aaholo']);
    gulp.watch( paths.ca.src     + '/*', ['caholo']);
    gulp.watch( paths.keg.src    + '/*', ['kegholo']);
    gulp.watch( paths.ld.src     + '/*', ['ldholo']);
    gulp.watch( paths.wcd.src    + '/*', ['wcdholo']);
    gulp.watch("./Destination/**/*.html").on('change', bs.reload);

});

// Default task that runs with command 'gulp' and calls other tasks specified
gulp.task('default', ['serve']);
