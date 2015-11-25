var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var myth = require('gulp-myth');

var jsPaths = ['./app.js', './controllers/*.js', './directives/*.js'];
var cssPaths = ['./style/bootstrap.css', './generated/help.myth.css'];

gulp.task('myth', function() {
	return gulp.src('./style/help.css')
		.pipe(myth())
		.pipe(rename({
			extname: '.myth.css'
		}))
		.pipe(gulp.dest('generated'));
});

gulp.task('style', ['myth'], function() {
	return gulp.src(cssPaths)
		.pipe(concat('all.css'))
		.pipe(gulp.dest('generated'));
});

gulp.task('scripts', function() {
	return gulp.src(jsPaths)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('all.js'))
		.pipe(gulp.dest('generated'));
});

gulp.task('scripts-min', ['scripts'], function() {
	return gulp.src('generated/all.js')
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('generated'));
});

gulp.task('watch', function() {
	gulp.watch(jsPaths, ['scripts-min']);
	gulp.watch('./style/help.css', ['style']);
})

gulp.task('default', ['scripts-min', 'style', 'watch'], function () {
    nodemon({
        script: 'server.js',
		verbose: true,
        ext: 'js',
        env: {
            PORT: 8080,
            SSL_PORT: 4443,
            ENABLE_REDIRECT: false,
            NODE_ENV: 'local-dev'
        },
        ignore: ['./node_modules/**', 'generated/*', 'app.js', 'controllers/*.js', 'directives/*.js']
    })
	.on('restart', function () {
	    console.log('Changes Occured, Restarting');
	});
});