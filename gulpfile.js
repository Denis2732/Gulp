var gulp 			= require('gulp'),
	less 			= require('gulp-less'),
	plumber 		= require('gulp-plumber'),
	browserSync 	= require('browser-sync'),
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglifyjs'),
	cssnano     	= require('gulp-cssnano'),
	rename      	= require('gulp-rename'),
	del         	= require('del'),
	imagemin    	= require('gulp-imagemin'),
    pngquant    	= require('imagemin-pngquant'),
    cache    		= require('gulp-cache'),
    autoprefixer 	= require('gulp-autoprefixer');

gulp.task('less', function() {
	return gulp.src('app/less/**/*.less')
	.pipe(plumber())
	.pipe(less())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src(['app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('code', function() {
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function(){
	return gulp.src('app/css/libs.css')
	.pipe(less())
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
})

gulp.task('browser-sync', function(done) {
	browserSync.init({
	server: {
		baseDir: 'app'
	},	
	notify: false
	});
	browserSync.watch('app').on('change', browserSync.reload);

	done()
});

gulp.task('clean', async function() {
    return del.sync('dist') 
});

gulp.task('img', function() {
    return gulp.src('app/img/**') 
        .pipe(cache(imagemin({ 
            interlaced: true,
            progressive: true
        })))
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('clear', function (callback) {
    return cache.clearAll();
});

gulp.task('prebuild', async function(){
	    var buildCss = gulp.src([ 
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') 
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') 
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('dist'))

});

gulp.task('watch', gulp.parallel('browser-sync', 'less', 'css-libs', 'scripts', 'img', function(done) {
	gulp.watch('app/img/**', gulp.series('img'));
	gulp.watch('app/less/**/*.less', gulp.series('less'));
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);

	done()
}));

gulp.task('build', gulp.parallel('prebuild', 'clean', 'less', 'scripts'));
