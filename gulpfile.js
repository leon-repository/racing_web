var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

//压缩，合并 js
gulp.task('minifyjs',function() {
    return gulp.src(['js/main.js', 'js/controller.js', 'js/commonLib.js'])      //需要操作的文件
        .pipe(concat('web.js'))    //合并所有js到 web.js
        .pipe(gulp.dest('dist'))       //输出到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist'));  //输出
});

gulp.task('minifyjs:watch', function () {
  gulp.watch('js/*.js', ['minifyjs']);
});


gulp.task('default',['minifyjs','minifyjs:watch']);
