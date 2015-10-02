var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', function(){
	nodemon({
		script: 'server.js',
		ext: 'js',
		env: {
			//PORT 80 if your machine will allow, or choose a port that is available
			// PORT: 8080
			PORT:80
		},
		ignore: ['./node_modules/**']
	})
	.on('restart', function(){
		console.log('Changes Occured, Restarting');
	});
});