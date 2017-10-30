// dependencies
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const util = require('gulp-util');
const fs = require('fs');
const concat = require('gulp-concat');
const gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
const conventionalChangelog = require('gulp-conventional-changelog');
const excludeGitignore = require('gulp-exclude-gitignore');
const gutil = require('gulp-util');
const tagVersion = require('gulp-tag-version');
const { join } = require('path');

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])
  // bump the version number in those files
    .pipe(bump({ type: importance }))
    // save it back to filesystem
    .pipe(gulp.dest('./'));
}

const getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

/**
 * Commit with message passed
 */
function commit() {
  const message = util.env.message ? util.env.message : `Release v${getPackageJson().version}`;
  return gulp.src('./', { buffer: false })
    .pipe(excludeGitignore())
    .pipe(git.add())
    .pipe(git.commit(message));
}

function push() {
  return git.push('origin', 'master', { args: '--tags -f' });
}

function tag() {
  return gulp.src(['./package.json']).pipe(tagVersion());
}

function changelog() {
  return gulp.src('CHANGELOG.md', {
    buffer: false,
  })
    .pipe(conventionalChangelog({
      preset: 'angular',
      releaseCount: 0,
      verbose: true,
    }, null, null, null, {
      // mainTemplate: fs.readFileSync(join(__dirname, 'changelog/template.hbs'), 'utf-8'),
      headerPartial: fs.readFileSync(join(__dirname, 'changelog/header.hbs'), 'utf-8'),
      commitPartial: fs.readFileSync(join(__dirname, 'changelog/commit.hbs'), 'utf-8'),
    }))

    .pipe(gulp.dest('./'));
}
gulp.task('changelog', changelog);
gulp.task('changelog:patch', ['patch'], changelog);
gulp.task('changelog:feature', ['feature'], changelog);
gulp.task('changelog:release', ['release'], changelog);

gulp.task('tag:patch', ['commit:patch'], tag);
gulp.task('tag:feature', ['commit:feature'], tag);
gulp.task('tag:release', ['commit:release'], tag);

gulp.task('commit:patch', ['patch', 'changelog:patch', 'docs'], commit);
gulp.task('commit:feature', ['feature', 'changelog:feature', 'docs'], commit);
gulp.task('commit:release', ['release', 'changelog:release', 'docs'], commit);

gulp.task('push:patch', ['tag:patch'], push);
gulp.task('push:feature', ['tag:feature'], push);
gulp.task('push:release', ['tag:release'], push);

gulp.task('patch', () => inc('patch'));
gulp.task('feature', () => inc('minor'));
gulp.task('release', () => inc('major'));

gulp.task('docs', () => gulp.src('src/**/*.js')
  .pipe(concat('README.md'))
  .pipe(gulpJsdoc2md({ template: fs.readFileSync('./template.hbs', 'utf8') }))
  .on('error', (err) => {
    gutil.log('jsdoc2md failed:', err);
  })
  .pipe(gulp.dest('./')));
