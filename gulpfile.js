const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const bs = require("browser-sync").create();
const ts = require('gulp-typescript');
const tsc = ts.createProject('tsconfig.json');

gulp.task("default", ["dev"]);
gulp.task("dev", ["watch"]);
gulp.task("build", ["sass", "ts"]);

gulp.task('ts', function () {
  const prj = tsc.src()
    .pipe(tsc())
    .on("error", function () {
      console.log(arguments);
    });

  return prj.js.pipe(gulp.dest('.'));
});

gulp.task("sass", function () {
  return gulp.src("./src/*.scss")
    .pipe(sass())
    .pipe(rename("tuna-jsgantt.css"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", ["ts", "sass", "bs"], function () {
  gulp.watch("./src/**/*.ts", ["ts"]);
  gulp.watch("./src/**/*.scss", ["sass"]);

  gulp.watch("./dist/**/*.*").on('change', bs.reload);
  gulp.watch("./demo/**/*.html").on('change', bs.reload);
});

gulp.task("bs", function () {
  bs.init({
    server: {
      baseDir: ["./demo"],
      routes: {
        "/dist": "dist",
        "/node_modules": "node_modules"
      }
    },
  })
});