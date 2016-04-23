'use strict';

const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const istanbulCombine = require('istanbul-combine');
const gulpMocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');

gulp.task('lint', () =>
  gulp.src([
    'app/**/*.js',
    'test/src/**/*.js',
    'startup.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs({configPath: '.jscsrc'}))
    .pipe(jscs.reporter('fail'))
);

gulp.task('ut-tests', (cb) => {
  gulp.src(['app/**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', () =>
      gulp.src(['test/src/unit/**/*-spec.js'])
        .pipe(gulpMocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports({
          dir: 'test/coverage/ut-coverage/reports',
          reporters: [
            'lcov',
            'json',
            'text'
          ],
          reportOpts: { dir: 'test/coverage/ut-coverage/reports'}
        }))
        .on('end', () => cb())
    );
});

gulp.task('api-tests', (cb) => {
  gulp.src(['app/**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', () =>
      gulp.src([
          'test/src/api/**/*-spec.js',
          'test/src/api/global.js'
        ])
        .pipe(gulpMocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports({
          dir: 'test/coverage/api-coverage/reports',
          reporters: [
            'lcov',
            'json',
            'text'
          ],
          reportOpts: {dir: 'test/coverage/api-coverage/reports'}
        }))
        .on('end', () => cb())
    );
});

gulp.task('merge-coverage', () =>
  istanbulCombine.sync({
    dir: 'test/coverage/all-coverage/reports',
    pattern: [
      'test/coverage/ut-coverage/reports/coverage-final.json',
      'test/coverage/api-coverage/reports/coverage-final.json'
    ],
    print: 'details',
    reporters: {
      lcov: {}
    }
  })
);

gulp.task('all-tests', () =>
  runSequence('lint', 'ut-tests', 'api-tests', 'merge-coverage')
);
