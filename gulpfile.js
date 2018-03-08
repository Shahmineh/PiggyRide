// @ts-nocheck
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
// eslint-disable-next-line no-unused-vars
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var styleSRC = 'www/src/scss/style.scss';
var styleDist = './www/dist/css/';
var styleWatch = 'www/src/scss/**/*.scss';

var jsSRC = 'main.js';
var jsFolder = 'www/src/js/';
var jsDist = './www/dist/js/';
var jsWatch = 'www/src/js/**/*.js';
var jsFiles = [jsSRC];

gulp.task('style', function () {
  let success = true;
  gulp
    .src(styleSRC)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
      })
    )
    .on('error', function (error) {
      success = false;
      console.log(error.stack);
      console.warn('\x1b[31m%s\x1b[0m', 'Gulp error (styles)');
      this.emit('end');
    })
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(styleDist))
    .on('end', function () {
      if (success) {
        console.log('\x1b[32m%s\x1b[0m', 'Styles compiled succesfully');
      }
    });
});

gulp.task('js', function () {
  let success = true;
  jsFiles.map(function (entry) {
    return (
      browserify({
        entries: [jsFolder + entry],
        debug: true
      })
        .transform(babelify, {
          presets: ['env'],
          sourceMaps: true
        })
        .bundle()
        .on('error', function (error) {
          success = false;
          console.log(error.stack);
          console.warn('\x1b[31m%s\x1b[0m', 'Gulp error (JavaScript)');
          this.emit('end');
        })
        .pipe(source(entry))
        .pipe(
          rename({
            extname: '.min.js'
          })
        )
        .pipe(buffer())
        .pipe(
          sourcemaps.init({
            loadMaps: true
          })
        )
        // .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsDist))
        .on('end', function () {
          if (success) {
            console.log('\x1b[32m%s\x1b[0m', 'JavaScript compiled succesfully');
          }
        })
    );
  });
});

gulp.task('default', ['style', 'js']);

gulp.task('watch', ['default'], function () {
  gulp.watch(styleWatch, ['style']);
  gulp.watch(jsWatch, ['js']);
});
