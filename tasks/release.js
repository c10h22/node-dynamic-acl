// dependencies
var gulp = require('gulp'),
	git = require('gulp-git'),
	bump = require('gulp-bump'),
	filter = require('gulp-filter'),
	tag_version = require('gulp-tag-version'),
	prompt = require('gulp-prompt'),
	util = require('gulp-util'),
	excludeGitignore = require('gulp-exclude-gitignore'),
	fs = require('fs'),
	conventionalChangelog = require('gulp-conventional-changelog'),
	join = require('path').join;
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
		.pipe(bump({type: importance}))
		// save it back to filesystem
		.pipe(gulp.dest('./'));
}


/**
 * Commit with message passed
 */
function commit() {
	var message = util.env.message ? util.env.message : "Release v" + getPackageJson().version;
	return gulp.src('./', {buffer: false})
		.pipe(excludeGitignore())
		.pipe(git.add())
		.pipe(git.commit(message));
}

function push(){
	return git.push('origin', 'master', {args:'--tags -f'});
}

function tag() {
	return gulp.src(['./package.json']).pipe(tag_version());
}

gulp.task('changelog', changelog);
var getPackageJson = function () {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};
function changelog() {
	return gulp.src('CHANGELOG.md', {
			buffer: false
		})
		.pipe(conventionalChangelog({
			preset: 'angular',
			releaseCount: 0,
			verbose: true
		}, null, null, null, {
			//mainTemplate: fs.readFileSync(join(__dirname, 'changelog/template.hbs'), 'utf-8'),
			headerPartial: fs.readFileSync(join(__dirname, 'changelog/header.hbs'), 'utf-8'),
			commitPartial: fs.readFileSync(join(__dirname, 'changelog/commit.hbs'), 'utf-8'),
		}))

		.pipe(gulp.dest('./'));
}

gulp.task('changelog:patch', ['patch'], changelog);
gulp.task('changelog:feature', ['feature'], changelog);
gulp.task('changelog:release', ['release'], changelog);

gulp.task('tag:patch', ['commit:patch'], tag);
gulp.task('tag:feature', ['commit:feature'], tag);
gulp.task('tag:release', ['commit:release'], tag);

gulp.task('commit:patch', ['patch', 'changelog:patch'], commit);
gulp.task('commit:feature', ['feature', 'changelog:feature'], commit);
gulp.task('commit:release', ['release', 'changelog:release'], commit);

gulp.task('push:patch', ['tag:patch'], push);
gulp.task('push:feature', ['tag:feature'], push);
gulp.task('push:release', ['tag:release'], push);

gulp.task('patch', function () {
	return inc('patch');
});
gulp.task('feature', function () {
	return inc('minor');
});
gulp.task('release', function () {
	return inc('major');
});
