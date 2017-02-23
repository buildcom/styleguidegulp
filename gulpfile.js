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
        holo: './hologram_config_aaa.yml',
        dest: './Destination/AAA'        
    },    
    ca: {
        src: './Source/CA',
        work: './Working/CA',
        holo: './hologram_config_ca.yml',
        dest: './Destination/CA'        
    },
    keg: {
        src: './Source/KEG',
        work: './Working/KEG',
        holo: './hologram_config_keg.yml',
        dest: './Destination/KEG'
    },
    ld: {
        src: './Source/LD',
        work: './Working/LD',
        holo: './hologram_config_ld.yml',
        dest: './Destination/LD'        
    },
    wcd: {
        src: './Source/WCD',
        work: './Working/WCD',
        holo: './hologram_config_wcd.yml',
        dest: './Destination/WCD'
    }
}

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

// BUILD AAA ==========================================
gulp.task('aaaholo', ['aaasass'], function() {
    // Build the CSS from the working directory
    gulp.src( paths.aaa.holo )
    .pipe(hologram({logging:true}));
});

// Sass build to css for export
gulp.task('aaasass',['copyaaa'], function() {
    return gulp.src(paths.aaa.work + '/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.aaa.dest));
}); 

// Copy all necessary AAA files to the working directory
gulp.task('copyaaa', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.aaa.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.aaa.work ) )
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest('./Destination/AAA'))
        .pipe(bs.stream());
});

// BUILD CA ==========================================
gulp.task('caholo', ['casass'], function() {
    // Build the CSS from the working directory
    gulp.src( paths.ca.holo )
    .pipe(hologram({logging:true}));
});

// Sass build to css for export
gulp.task('casass',['copyca'], function() {
    return gulp.src(paths.ca.work + '/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.ca.dest));
}); 

// Copy all necessary CA files to the working directory
gulp.task('copyca', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.ca.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.ca.work ) )
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest('./Destination/CA'))
        .pipe(bs.stream());
});

// BUILD KEG ==========================================
gulp.task('kegholo',['kegsass'], function() {
    //Build the CSS from the working directory  
    gulp.src( paths.keg.holo )
    .pipe(hologram({logging:true}));
});

// Sass build to css for export
gulp.task('kegsass',['copykeg'], function() {
    return gulp.src(paths.keg.work + '/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.keg.dest));
}); 

//Copy all necessary Keg files to the working directory
gulp.task('copykeg', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.keg.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.keg.work ) )
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest(paths.keg.dest))
        .pipe(bs.stream());        
});

// BUILD LD ==========================================
gulp.task('ldholo', ['ldsass'], function() {
    // Build the CSS from the working directory  
    gulp.src( paths.ld.holo )
    .pipe(hologram({logging:true}));
});

// Sass build to css for export
gulp.task('ldsass',['copyld'], function() {
    return gulp.src(paths.ld.work + '/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.ld.dest));
}); 

// Copy all necessary LD files to the working directory
gulp.task('copyld', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.ld.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.ld.work ) )
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest('./Destination/LD'))
        .pipe(bs.stream());
});

// BUILD WCD ==========================================
gulp.task('wcdholo', ['wcdsass'], function() {
    // Build the CSS from the working directory  
    gulp.src( paths.wcd.holo )
    .pipe(hologram({logging:true}));
});

// Sass build to css for export
gulp.task('wcdsass',['copywcd'], function() {
    return gulp.src(paths.wcd.work + '/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.wcd.dest));
}); 

// Copy all necessary WCD files to the working directory
gulp.task('copywcd', function() {
    return gulp.src( [paths.shared.src + "/**/*.scss", paths.wcd.src + "/**/*.scss"] )
        .pipe( gulp.dest( paths.wcd.work ) )
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest('./Destination/WCD'))
        .pipe(bs.stream());
});

// REMOVE OLD FILES ===================================
gulp.task('clean', function () {
  return del([
    // Obliterate these files
    'Destination/**/*',
    'Working/**/*',
    // Save these files
    '!index.md',
  ]);
});

// SERVE FILES => BROWSERSYNC ==========================================
gulp.task('serve', ['aaaholo','caholo','kegholo','ldholo','wcdholo'], function () {
    // Serve files from the Destinaion folder
    bs.init({
        server: {
            baseDir: "./",
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
