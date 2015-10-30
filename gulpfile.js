var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('style', function() {
	return gulp.src(['style/bootstrap.css', 'style/help.css'])
		.pipe(concat('all.css'))
		.pipe(gulp.dest('generated'));
});

gulp.task('scripts', function() {
	return gulp.src(['app.js', 'controllers/*.js', 'directives/*.js'])
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

gulp.task('default', ['style', 'scripts-min'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js,css',
		tasks: ['style', 'scripts-min'],
        env: {
            PORT: 8080,
            SSL_PORT: 4443,
            ENABLE_REDIRECT: false,
            NODE_ENV: 'local-dev'
        },
        ignore: ['./node_modules/**', 'generated/*']
    })
	.on('restart', function () {
	    console.log('Changes Occured, Restarting');
	});
});