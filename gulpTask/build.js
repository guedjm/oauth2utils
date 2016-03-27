'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const merge = require('merge2');

gulp.task('build', function () {
  const project = ts.createProject('./tsconfig.json');

  console.log("Building project ...");
  var tsResult = project.src()
    .pipe(ts(project));

  return merge([
    tsResult.dts.pipe(gulp.dest(".")),
    tsResult.js.pipe(gulp.dest("."))
  ]);
});

gulp.task("clean", function (cb) {
  console.log("Cleaning project ...");
  return gulp.src(["./index.js", "./index.d.ts", "./lib", "./coverage"], { read: false})
    .pipe(clean());
});