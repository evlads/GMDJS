let browserSync   = require('browser-sync'),
		gulp          = require('gulp'),
		
		postcss       = require('gulp-postcss'),
		autoprefixer  = require('autoprefixer'),
		cssnano       = require('cssnano'),
		fonts         = require('postcss-font-magician'),
		sass          = require('gulp-sass'),
		bourbon       = require('node-bourbon'),
		media         = require('gulp-group-css-media-queries'),
		notify        = require('gulp-notify'),
		jade          = require('gulp-jade');
		
gulp.task('browserSync', function () {
	browserSync({
		server: {
			baseDir: 'assets'
		},
		notify: false
	})
});

gulp.task('postcss', function () {
	const processor = ([
			//autoprefixer({browsers: ['last 10 version']}),
			cssnano(),
			fonts()
	]);
	return gulp.src('./assets/sass/*.sass')
			.pipe(sass({includePaths: bourbon.includePaths}).on("error", notify.onError()))
			.pipe(media())
			.pipe(postcss(processor))
			.pipe(gulp.dest('./assets/css'))
			.pipe(browserSync.reload({stream: true}))
});

gulp.task('jade', function buildHTML() {
	return gulp.src('assets/*.pug')
			.pipe(jade({
				pretty: true
			}).on("error", notify.onError()))
			.pipe(gulp.dest('assets'))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['postcss', 'jade', 'browserSync'], function () {
	gulp.watch('assets/sass/**/*.sass', ['postcss']);
	gulp.watch(['assets/*.pug', 'assets/pug/**/*.jade'], ['jade']);
	gulp.watch('assets/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);