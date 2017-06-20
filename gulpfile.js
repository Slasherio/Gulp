var gulp = require('gulp'),
    sass = require('gulp-sass'), // for compile from sass to css
    browserSync = require('browser-sync'), // for liveReload
    concat = require('gulp-concat'), // for concatination
    uglify = require('gulp-uglifyjs'), // for uglifying
    cssnano = require('gulp-cssnano'), // for minification
    del = require('del'), // for deleting folder dist before bulding
    imagemin = require('gulp-imagemin'), //for optimization images
    autoprefixer = require('gulp-autoprefixer'), //for adding prefixer
    jshint = require('gulp-jshint'), // for javascript files
    babel = require('gulp-babel'); //for transpiling ES6 to ES5

//Task for from sass to css
gulp.task('sass', function() {
    return gulp.src('src/sass/*.sass') //take a source
        .pipe(sass()) // transform sass to css
        .pipe(autoprefixer()) //add prefixer
        .pipe(gulp.dest('src/css')) //uload result
        .pipe(browserSync.reload({ stream: true })) // for reload page, when css will be change
});

//Task for hinter js code
gulp.task('hint', function() {
    return gulp.src('src/js/**/*.js') //take all files in directory js
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

//Task for babel JS
gulp.task('babel', () => {
    return gulp.src('src/js/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dest/js'));
});


//Task for minify our script and concat their into one file
gulp.task('scripts', function() {
    // take all necessary libs
    return gulp.src([
            'src/libs/jquery/dist/jquery.min.js',
            'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat('libs.min.js')) //concat their 
        .pipe(uglify()) // minify their
        .pipe(gulp.dest('src/js')); //unload result
});

//Task for livereloading our page
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src' //directory for server 
        },
        notify: false //disable notification about reloading
    });
});

//Task for watching and load another tasks
gulp.task('watch', ['browser-sync', 'sass', 'scripts', 'hint', 'babel'], function() {
    gulp.watch('src/sass/*.sass', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dest'); // Delete folder dest before build
});

gulp.task('build', ['clean', 'sass', 'scripts'],
    function() {
        //Load files from app folder into production folder dist
        var buildCss = gulp.src('src/css/**/*') // Dest css in production
            .pipe(cssnano())
            .pipe(gulp.dest('dest/css'))

        var buildFonts = gulp.src('src/fonts/**/*') //Dest fonts in production
            .pipe(gulp.dest('dest/fonts'))

        var buildImage = gulp.src('src/img/**/*') // Dest img in production
            .pipe(imagemin())
            .pipe(gulp.dest('dest/img'))

        var buildJS = gulp.src('src/js/**/*') //Dest js in production
            .pipe(gulp.dest('dest/js'))

        var buildHtml = gulp.src('src/*.html') //Dest html in production
            .pipe(gulp.dest('dest'));
    });

gulp.task('default', ['watch']);