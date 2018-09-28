const MODULES_BIN = 'node_modules/.bin/';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const liveServer = require('gulp-live-server');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const del = require('del');
const crypto = require('crypto');

//Test tasks-----------------------------
gulp.task('test:env', (done) => {
    process.env.NODE_ENV = 'test';
    process.env.TOKEN_SECRET = crypto.randomBytes(48).toString('hex');
    done();
});

gulp.task('test:prepare', ['test:env', 'db:cleanup', 'db:migrate']);

gulp.task('test:run', ['test:prepare'], () => {
    return gulp.src(['test/**/*.js'])
        .pipe(mocha({
            reporter: 'spec',
            slow: 0
        }));
});

gulp.task('test:lint', () => {
    return gulp.src(['index.js', 'gulpfile.js', 'app/**/*.js', 'test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
//Test tasks-----------------------------


//DB Tasks-------------------------------
gulp.task('db:migrate', (done) => {
    exec(MODULES_BIN + '/sequelize db:migrate', (err) => {
        done(err);
    });
});

gulp.task('db:cleanup', () => {
    var env = process.env.NODE_ENV || 'development';
    return del('db/' + env + '.sqlite3');
});
//DB Tasks-------------------------------


//Exec Tasks-----------------------------
gulp.task('exec:express', ['db:migrate'], () => {
    var server = liveServer.new('./index.js');
    server.start();
    gulp.watch(['index.js', 'app/**/*.js'], file => {
        server.start();
        server.notify(file);
    });
});
//Exec Tasks-----------------------------


//Exports to Gulp------------------------
gulp.task('test', ['test:lint', 'test:run']);

gulp.task('run', ['db:migrate', 'exec:express']);
//Exports to Gulp------------------------