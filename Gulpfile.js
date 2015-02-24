
var path = require('path'),
	gulp = require('gulp'),
	react = require('gulp-react'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	del = require('del');

gulp.task('clean', function(done) {
	del(['lib/'], done);
});

gulp.task('lib', function() {
	return gulp.src('src/*.js')
		.pipe(react({harmony: true}))
		.pipe(gulp.dest('lib'));
});

gulp.task('browserify', function() {
  return browserify({
  		entries: [path.join(__dirname, 'src', 'index.js')],
  		standalone: 'Emf'
	})
	.bundle()
	.pipe(source('Emf.js'))
	.pipe(gulp.dest('./dist/'))
});

gulp.task('pre-commit', ['clean']);
gulp.task('pre-publish', ['lib', 'browserify'])
gulp.task('default', ['pre-commit']);