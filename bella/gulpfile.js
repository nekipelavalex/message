var gulp       = require('gulp'); // Подключаем Gulp
	browserSync  = require('browser-sync'); // Подключаем Browser Sync
	concat       = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
	del          = require('del'); // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'); // Подключаем библиотеку кеширования
  
gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
	gulp.watch("src/*.html").on('change', browserSync.reload);
});
 
gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});
 
gulp.task('clean', async function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});
 
gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
 
gulp.task('prebuild', async function() {
 
	const buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));
 
});
 
gulp.task('clear', function (callback) {
	return cache.clearAll();
})
 
gulp.task('watch', function() {
	gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
});
gulp.task('default', gulp.parallel('browser-sync', 'watch'));
// gulp.task('build', gulp.parallel('prebuild', 'clean', 'img'));