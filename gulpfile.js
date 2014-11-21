var gulp        = require("gulp");
var sass        = require("gulp-ruby-sass");
var filter      = require('gulp-filter');
var browserSync = require("browser-sync");
var scsslint    = require('gulp-scss-lint');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps');
var svgstore    = require('gulp-svgstore')
var inject      = require('gulp-inject')


// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  browserSync({
    proxy: "localhost:9292"
  });
});

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(scsslint({'config': '.scss-lint.yml'}))

        // Load existing internal sourcemap
        .pipe(sourcemaps.init())

        // Convert sass into css
        .pipe(sass({ sourcemapPath: '/app/scss'}))

        // Catch any SCSS errors and prevent them from crashing gulp
        .on('error', function (error) {
            console.error(error);
            this.emit('end');
        })

        .pipe(sourcemaps.write('.'))

        

        // Autoprefix properties
        // .pipe(prefix("last 2 versions", "> 1%", "ie 8"))

        // Save the CSS
        .pipe(gulp.dest('assets/css'))

      .pipe(filter('**/*.css')) // Filtering stream to only css files
      .pipe(browserSync.reload({stream:true}));
});


// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/js/**/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('assets/scripts'))
    //.pipe(rename({ suffix: '.min' }))
    //.pipe(browserify())
    //.pipe(uglify())
    //.pipe(gulp.dest('assets/scripts'))
});


gulp.task('svg', function () {
  var svgs = gulp.src('app/svg/*.svg')
                 .pipe(svgstore({inlineSvg: true }))
  function fileContents (filePath, file) {
    return file.contents.toString('utf8')
  }
  function transformSvg ($svg, done) {
    $svg.find('[fill]').removeAttr('fill')
    done(null, $svg)
  }
  return gulp
    .src('_includes/svgstore.html')
    .pipe(inject(svgs, { transform: fileContents }))
    .pipe(gulp.dest('_includes/'))
})


// Default task to be run with `gulp`
gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch("app/scss/**/*.scss", ['sass']);
  gulp.watch("**/*.html", browserSync.reload);
  gulp.watch("app/js/*.js", ['scripts', browserSync.reload]);
});