var gulp = require("gulp"),
  concat = require("gulp-concat"),
  autoprefixer = require("gulp-autoprefixer"),
  livereload = require("gulp-livereload"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  notify = require("gulp-notify"),
  zip = require("gulp-zip"),
  ftp = require("vinyl-ftp");

//
gulp.task("css", function () {
  return (
    gulp
      .src("project/*.css")
      .pipe(sourcemaps.init())
      .pipe(autoprefixer(""))
      .pipe(concat("all.css"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"))
      //.pipe(notify("Hello Gulp!")); for only window 10
      .pipe(livereload())
  );
});
//
gulp.task("js", function () {
  return gulp
    .src("project/js/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});
//
gulp.task("compress", function () {
  return gulp.src("dist/**/*.*").pipe(zip("archive.zip")).pipe(gulp.dest("."));
});

//
gulp.task("deploy", function () {
  var conn = ftp.create({
    host: "",
    user: "me",
    password: "mypass",
    parallel: 10,
  });
  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance
  return gulp
    .src(["dist/**/*.*"], { base: ".", buffer: false })
    .pipe(conn.newer("/public_html")) // only upload newer files
    .pipe(conn.dest("/public_html"))
    .pipe(livereload());
});

// watch task
gulp.task("watch", function () {
  require("./server.js");
  livereload.listen();
  gulp.watch("project/*.css", ["css"]);
  gulp.watch("project/js/*.js", ["js"]);
  gulp.watch("dist/**/*.*", ["compress"]);
  gulp.watch("dist/**/*.*", ["compress"]);
  // gulp.watch("dist/**/*.*", ["deploy"]); you need server to work
});
