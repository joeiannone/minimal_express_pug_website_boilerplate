const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const image = require('gulp-image');
const fontmin = require('gulp-fontmin');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const js_src = 'js/*.js';
const css_src = 'style/*.css';
const js_dest = 'public';
const css_dest = 'public';

gulp.task('sass', function () {
  return gulp.src('./style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./style'));
});

gulp.task('watch', async function(done) {
  gulp.watch('./style/*.css', gulp.series('minifycss'));
  gulp.watch('js/*.js', gulp.series('minifyjs'));
  gulp.watch('./style/*.scss',gulp.series('sass'));
  gulp.watch('./images/*/*', gulp.series('image'));
  gulp.watch('./images/*', gulp.series('image'));
  done();
});

gulp.task('libraries', async function() {
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('public/libraries/bootstrap'))

  gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest('public/libraries/bootstrap'))

  gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('public/libraries/jquery'))

  gulp.src('./node_modules/@fortawesome/fontawesome-free/css/all.min.css')
    .pipe(gulp.dest('public/libraries/fontawesome'))

  gulp.src('./node_modules/@fortawesome/fontawesome-free/js/all.min.js')
    .pipe(gulp.dest('public/libraries/fontawesome'))

});

gulp.task('minifyjs', async function() {
  return gulp.src(js_src)
    .pipe(minify({
      noSource: true
    }))
    .pipe(concat('site.min.js'))
    .pipe(gulp.dest(js_dest));
});

gulp.task('minifycss', async function () {
  return gulp.src(css_src)
    .pipe(concat('site.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(minify())
    .pipe(gulp.dest(css_dest))
});


gulp.task('image', async function (done) {
  gulp.src('./images/logo/*')
    .pipe(image())
    .pipe(gulp.dest('public/images/logo'));

  gulp.src('./images/homepage/*')
    .pipe(image())
    .pipe(gulp.dest('public/images/main'));

  done();
});
