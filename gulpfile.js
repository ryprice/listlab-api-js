var gulp = require('gulp');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var requirejsOptimize = require('gulp-requirejs-optimize');
var rename = require('gulp-rename');
var tslint = require('gulp-tslint');
var sequence = require('gulp-sequence');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var dtsGenerator = require('dts-generator').default;




var srcPaths = ['./src/**'];

var typescriptConfig = {
    "module": "amd",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": false,
    "target": "es5",
    "moduleResolution": "classic",
    "noEmit": false,
    "baseUrl": "./src",
    "typeRoots": ["typings/globals", "typings/modules"]
};

var modulePaths = {
    "axios": './node_modules/axios/index',
    "q": './node_modules/q/q',
    "qs": './node_modules/qs/dist/index'
}

gulp.task("tslint", () => {
    return gulp.src(["src/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

gulp.task('tsc-debug', () => {
    return gulp.src(srcPaths)
        .pipe(typescript(typescriptConfig))
        .pipe(gulp.dest(destPath));
});

gulp.task('release-intermediate', () => {
    return gulp.src(srcPaths)
        .pipe(typescript(typescriptConfig))
        .pipe(gulp.dest("build/intermediate"));
});

gulp.task('minify-release', () => {
    var requirejsOptimizeConfig = {
        name: 'index.js',
        out: 'ququmber-api.js',
        paths: modulePaths,
        baseUrl: 'build/intermediate'
    };
    gulp.src(['build/intermediate/bundles/' + bundle + '.js'])
        .pipe(requirejsOptimize(requirejsOptimizeConfig))
        .pipe(gulp.dest("build/"));
});

gulp.task('concat-declarations', () => {
  dtsGenerator({
      name: 'ququmber-api',
      project: './',
      main: 'ququmber-api/index',
      externs: ['q', 'qs', 'axios'],
      excludes: ['./typings/**/*.d.ts'],
      out: 'dist/ququmber-api.d.ts'
  });
})


// External tasks

var destPath = './build';

gulp.task('debug', function(cb) {
    sequence(
        'tslint',
        'tsc-debug',
        'concat-declarations'
    )(cb);
});

gulp.task('release', (cb) => {
    sequence(
        ['tslint', 'release-intermediate'],
        'minify-release',
        'concat-declarations'
    )(cb);
});

gulp.task('watch', function() {
    gulp.watch(srcPaths, ['debug']);
});
