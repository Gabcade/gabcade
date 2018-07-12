/*
 * gulpfile.js
 * Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
 * License: MIT
 */

'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
// const plumber = require('gulp-plumber');
const livereload = require('gulp-livereload');
const less = require('gulp-less');

gulp.task('less', () => {
  gulp.src('public/css/style.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', () => {
  gulp.watch('public/css/**/*.less', ['less']);
});

gulp.task('develop', () => {
  livereload.listen();
  nodemon({
    script: 'gabcade.js',
    ext: 'js coffee pug',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', (chunk) => {
      if (/Gabcade.com server listening/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'less',
  'develop',
  'watch'
]);
