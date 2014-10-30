var gulp        = require("gulp");
var sass        = require("gulp-ruby-sass");
var filter      = require('gulp-filter');
var browserSync = require("browser-sync");
var scsslint    = require('gulp-scss-lint');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps');


// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  browserSync({
    proxy: "bricklanerecords.dev"
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
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('assets/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('assets/scripts'))
});



// Default task to be run with `gulp`
gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch("app/scss/**/*.scss", ['sass']);
  gulp.watch("**/*.html", browserSync.reload);
  gulp.watch("app/js/*.js", ['js', browserSync.reload]);
});