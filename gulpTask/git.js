"use strict";

const gulp = require('gulp');
const git = require('gulp-git');
const prompt = require("gulp-prompt");

gulp.task("add-release", function (cb) {
  return gulp.src("./release")
    .pipe(git.add());
});

gulp.task("exec-commit", function (cb) {
  gulp.src("./")
    .pipe(prompt.prompt({
      type: 'input',
      name: 'msg',
      message: "Commit message :"
    }, function (res) {
      if (!res.msg || res.msg.length == 0) {
        console.log("Please enter a valid commit message");
      }
      else {

        gulp.src("./")
          .pipe(git.commit(res.msg, {args: "-a"}))
          .on("end", cb);
      }
    }));
});

gulp.task("exec-push", function (cb) {

  git.exec({args: "rev-parse --abbrev-ref HEAD"}, function (err, stdout) {
    if (err) {
      cb(err);
    }
    else {
      let branch = stdout.replace("\n", "");

      git.exec({args: "remote"}, function (err, stdout) {
        if (err) {
          cb(err);
        }
        else if (stdout == null || stdout == "") {
          console.log("No git remote configured");
        }
        else {
          const remotes = stdout.split("\n");
          remotes.pop();
          if (remotes.length > 1) {
            gulp.src("./")
              .pipe(prompt.prompt({
                type: "checkbox",
                name: "rem",
                message: "Select the remote you to push on :",
                choices: remotes
              }, function (res) {
                let pushRemote = res.rem;

                pushRemote.forEach(function (elem, i, a) {
                  git.push(elem, branch, function (err) {
                    if (err) {
                      cb(err);
                    }
                    else if (i == a.length - 1) {
                      cb();
                    }
                  });
                });
              }));
          } else {
            git.push(remotes[0], branch, function (err) {
              cb(err);
            });
          }
        }
      });
    }
  });
});
