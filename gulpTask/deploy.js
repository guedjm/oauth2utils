"use strict";

const fs = require("fs");
const gulp = require("gulp");
const clean = require('gulp-clean');
const shell = require("gulp-shell");
const rename = require("gulp-rename");
const runSequence = require("run-sequence");

gulp.task("push-success", function (cb) {
  const pkg = JSON.parse(fs.readFileSync("./package.json"));
  console.log("Version " + pkg.version + " successfully pushed !");
});

gulp.task("create-package", shell.task("npm pack"));

gulp.task("release-package", function () {
  const pkg = JSON.parse(fs.readFileSync("./package.json"));
  const packageName = `${pkg.name}-${pkg.version}.tgz`;

  gulp.src(`./${packageName}`)
    .pipe(rename(packageName))
    .pipe(gulp.dest("./release"));

  gulp.src(`./${packageName}`)
    .pipe(rename(`${pkg.name}.tgz`))
    .pipe(gulp.dest("./release"));

  return gulp.src([`./${packageName}`], { read: false})
    .pipe(clean());
});

gulp.task("push", function (cb) {
  runSequence(
    "format",
    "lint",
    "clean",
    "build",
    "test",
    "bump",
    "create-package",
    "release-package",
    "add-release",
    "exec-commit",
    "exec-push",
    "push-success",
    cb);
});