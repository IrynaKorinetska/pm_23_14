import gulp from "gulp";
import concat from "gulp-concat";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import cssnano from "gulp-cssnano";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";

const scss = gulpSass(sass);
const paths = {
  images: {
    src: "src/images/*",
    dest: "dist/images",
  },
};

gulp.task("html", function () {
  return gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("scss", () => {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(scss().on("error", scss.logError))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("js", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("images", function () {
  return gulp
    .src(paths.images.src, {
      encoding: false,
    })
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
});

gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });

  gulp.watch("src/*.html", gulp.series("html"));
  gulp.watch("src/scss/**/*.scss", gulp.series("scss"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
});

gulp.task("default", gulp.series("html", "scss", "js", "images", "serve"));
