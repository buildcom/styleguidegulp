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
        src: './Source/Wine',
        work: './Working/Wine',
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
    gulp.src(paths.dw.aaa + '/**').pipe(gulp.dest(paths.aa.src));
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
    gulp.src(paths.aa.src + '/**').pipe(gulp.dest(paths.dw.aaa));
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

// BUILD WINE ==========================================
gulp.task('wcdholo', ['copywcd'], function() {
    // Build the CSS from the working directory  
    gulp.src( paths.wcd.holo )
    .pipe(hologram({logging:true}));
});

// Copy all necessary Wine files to the working directory
gulp.task('copywcd', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.wcd.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.wcd.work ) )
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Destination/Wine'))
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
