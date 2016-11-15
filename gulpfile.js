'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    hologram = require('gulp-hologram'),
    bs = require('browser-sync').create(),
    reload = bs.reload,
    del = require('del');

var paths = {
    shared: {
        src: './Source/Shared'
    },
    aaa: {
        src: './Source/AAA',
        work: './Working/AAA',
        holo: './hologram_config_aaa.yml'
    },    
    ca: {
        src: './Source/CA',
        work: './Working/CA',
        holo: './hologram_config_ca.yml'
    },
    keg: {
        src: './Source/KEG',
        work: './Working/KEG',
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
    },
    dw: {
        aaa: '../demandwareSites/app_app_bootstrap/cartridge/sass/semantic',
        ca: '../demandwareSites/app_ca_bootstrap/cartridge/sass/semantic',
        ld: '../demandwareSites/app_ld_bootstrap/cartridge/sass/semantic',
        keg: '../demandwareSites/app_keg_bootstrap/cartridge/sass/semantic',
        wcd: '../demandwareSites/app_wcd_bootstrap/cartridge/sass/semantic',
        shared: '../demandwareSites/app_bootstrap/cartridge/sass/semantic'
    }
}

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

// Import from Demandware Sites repo
gulp.task('import', function(){
    // AAA
    gulp.src(paths.dw.aaa + '/**').pipe(gulp.dest(paths.aaa.src));
    // CA
    gulp.src(paths.dw.ca + '/**').pipe(gulp.dest(paths.ca.src));
    // LD
    gulp.src(paths.dw.ld + '/**').pipe(gulp.dest(paths.ld.src));
    // KEG
    gulp.src(paths.dw.keg + '/**').pipe(gulp.dest(paths.keg.src));
    // WCD
    gulp.src(paths.dw.wcd + '/**').pipe(gulp.dest(paths.wcd.src));
    // SHARED
    gulp.src(paths.dw.shared + '/**').pipe(gulp.dest(paths.shared.src));
});

// Export to Demandware Sites repo
gulp.task('export', function(){
    // AAA
    gulp.src(paths.aaa.src + '/**').pipe(gulp.dest(paths.dw.aaa));
    // CA
    gulp.src(paths.ca.src + '/**').pipe(gulp.dest(paths.dw.ca));
    // LD
    gulp.src(paths.ld.src + '/**').pipe(gulp.dest(paths.dw.ld));
    // KEG
    gulp.src(paths.keg.src + '/**').pipe(gulp.dest(paths.dw.keg));
    // WCD
    gulp.src(paths.wcd.src + '/**').pipe(gulp.dest(paths.dw.wcd));
    // SHARED
    gulp.src(paths.shared.src + '/**').pipe(gulp.dest(paths.dw.shared));
});

// BUILD AAA ==========================================
gulp.task('aaaholo', ['copyaaa'], function() {
    // Build the CSS from the working directory
    gulp.src( paths.aaa.holo )
    .pipe(hologram({logging:true}));
});

// Copy all necessary AAA files to the working directory
gulp.task('copyaaa', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.aaa.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.aaa.work ) )
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
        .pipe(gulp.dest('./Destination/KEG'))
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

// REMOVE OLD FILES ===================================
gulp.task('clean', function () {
  return del([
    // Obliterate these files
    'Destination/**/*',
    'Working/**/*',
    // Save these files
    '!index.md'
  ]);
});

// SERVE FILES => BROWSERSYNC ==========================================
gulp.task('serve', ['aaaholo','caholo','kegholo','ldholo','wcdholo'], function () {
    // Serve files from the Destinaion folder
    bs.init({
        server: {
            baseDir: "Destination",
            directory: true
        }
    });

    gulp.watch( paths.shared.src + '/*', ['aaaholo','caholo','kegholo','ldholo','wcdholo']);
    gulp.watch( paths.aaa.src     + '/*', ['aaaholo']);
    gulp.watch( paths.ca.src     + '/*', ['caholo']);
    gulp.watch( paths.keg.src    + '/*', ['kegholo']);
    gulp.watch( paths.ld.src     + '/*', ['ldholo']);
    gulp.watch( paths.wcd.src    + '/*', ['wcdholo']);
    gulp.watch("./Destination/**/*.html").on('change', bs.reload);

});

// COMPILE ==========================================
gulp.task('compile', ['aaaholo','caholo','kegholo','ldholo','wcdholo']);

// Default task that runs with command 'gulp' and calls other tasks specified
gulp.task('default', ['serve']);
