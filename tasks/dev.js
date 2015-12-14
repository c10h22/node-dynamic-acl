import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import path from 'path';
import del from 'del';
import {spawn} from 'child_process';
import rename from 'gulp-rename';
import mocha from 'gulp-mocha';
import gutil from 'gulp-util';

var node;

var paths = {
	js: {
		src: 'src/**/*.js',
		dist: 'dist/'
	},
	test: {
		src: 'test/**/*.js',
		dist: 'test-dist/',
		run: 'test-dist/**/*.js'
	},
	config: {
		src: 'src/example/config/**/*',
		dist: 'dist/example/config'
	},
	// Must be absolute or relative to source map
	sourceRoot: path.resolve('src')
};

/**
 * $ gulp babel:test
 * description: Clean test compiled files & sourcemaps
 */
gulp.task('babel:test', ['babel:src', 'clean:test'], () =>
	gulp.src(paths.test.src)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.', {sourceRoot: paths.sourceRoot}))
		.pipe(gulp.dest(paths.test.dist))
);

/**
 * $ gulp babel:src
 * description: Compile es6 files to es5 and put them in dist directory
 */
gulp.task('babel:src', ['clean:dist'], () =>
	gulp.src(paths.js.src)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.', {sourceRoot: paths.sourceRoot}))
		.pipe(gulp.dest(paths.js.dist))
);

gulp.task('babel:config', ['config', 'clean:config'], () => gulp.src(paths.config.src + '.js')
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(sourcemaps.write('.', {sourceRoot: paths.sourceRoot}))
	.pipe(gulp.dest(paths.config.dist)));
/**
 * $ gulp babel
 * description: Compile all es6 files to es5 and put them in dist directories
 */
gulp.task('babel', ['babel:src', 'babel:test']);

/**
 * $ gulp config
 * description: Copy config directory to dist directory
 */
gulp.task('config', ['clean:config'], () => {
	return gulp.src(paths.config.src + '.json')
		.pipe(gulp.dest(paths.config.dist));
});

/**
 * $ gulp clean:config
 * description: cleans config directory in dist directory
 *
 * */
gulp.task('clean:config', () => del(paths.config.dist));

/**
 * $ gulp clean:test
 * description: Cleans compiled test files
 **/
gulp.task('clean:test', () => del(paths.test.dist));

/**
 * $ gulp clean:dist
 * description: cleans dist directory
 * */
gulp.task('clean:dist', [], () => del(paths.js.dist));

/**
 * $ gulp clean
 * description: Cleans all compiled files
 */
gulp.task('clean', ['', 'clean:dist', 'clean:test']);

/**
 *$ gulp mocha
 * description: runs unit tests
 * */
gulp.task('mocha', ['babel:test'], () => {
	return gulp.src([paths.test.run], {read: false})
		.pipe(mocha({reporter: 'spec'}))
		.on('error', gutil.log);
});

/**
 * $ gulp watch
 * description: Watches change in working files
 */
gulp.task('watch', function () {
	gulp.watch(paths.js.src, ['babel:src']);
	gulp.watch(paths.test.src, ['babel:test']);
	//gulp.watch(paths.config.src, ['babel:config']);
});

gulp.task('watch:mocha', () => {
	gulp.watch(paths.test.src, ['mocha']);
});


/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', ['babel', 'mocha'], function () {
	if (node) node.kill();
	node = spawn('node', ['dist/server.js'], {stdio: 'inherit'});
	node.on('close', function (code) {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
	});
});


/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', ['babel', 'watch', 'server']);

// clean up if an error goes unhandled.
process.on('exit', function () {
	if (node) node.kill()
});

