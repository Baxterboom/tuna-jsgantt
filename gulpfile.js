const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const bs = require("browser-sync").create();
const ts = require("gulp-typescript");
const tscSrc = ts.createProject("tsconfig.json");
const tscWorkers = ts.createProject("./src/workers/tsconfig.json");

//https://github.com/gulpjs/undertaker-forward-reference
const forwardReference = require("undertaker-forward-reference");
gulp.registry(forwardReference());

gulp.task("default", gulp.parallel("dev"));
gulp.task("dev", gulp.series("build", gulp.parallel("watch", "bs")));
gulp.task("build", gulp.parallel("sass", "ts"));

gulp.task("ts", gulp.series("ts-src", "ts-workers"), function () {});

gulp.task("ts-src", function () {
  const prj = tscSrc.src()
    .pipe(tscSrc())
    .on("error", function () {
      console.error(arguments);
    });

  return prj.js.pipe(gulp.dest("."));
});

gulp.task("ts-workers", function () {
  const prj = tscWorkers.src()
    .pipe(tscWorkers())
    .on("error", function () {
      console.error(arguments);
    });

  return prj.js.pipe(gulp.dest("./dist/workers"));
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

gulp.task("watch", function () {
  gulp.watch("./src/**/*.ts", gulp.series("ts"));
  gulp.watch("./src/**/*.scss", gulp.series("sass"));

  gulp.watch("./dist/**/*.*").on("change", bs.reload);
  gulp.watch("./demo/**/*.html").on("change", bs.reload);
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