const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const bs = require("browser-sync").create();
const ts = require('gulp-typescript');
const tscSrc = ts.createProject('tsconfig.json');
const tscWorkers = ts.createProject('./src/workers/tsconfig.json');

gulp.task("default", ["dev"]);
gulp.task("dev", ["watch"]);
gulp.task("build", ["sass", "ts", "ts"]);

gulp.task('ts', ['ts-src', 'ts-workers'], function () {});

gulp.task('ts-src', function () {
  const prj = tscSrc.src()
    .pipe(tscSrc())
    .on("error", function () {
      console.error(arguments);
    });

  return prj.js.pipe(gulp.dest('.'));
});

gulp.task('ts-workers', function () {
  const prj = tscWorkers.src()
    .pipe(tscWorkers())
    .on("error", function () {
      console.error(arguments);
    });

  return prj.js.pipe(gulp.dest('./dist/workers'));
});

gulp.task("sass", function () {
  return gulp.src("./src/*.scss")
    .pipe(sass())
    .on("error", function () {
      console.error(arguments);
    })
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