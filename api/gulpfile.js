const MODULES_BIN = 'node_modules/.bin/';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const liveServer = require('gulp-live-server');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const del = require('del');

//Test tasks-----------------------------
gulp.task('test:env', (done) => {
  process.env.NODE_ENV = 'test';
  done();
});

gulp.task('test:run', ['db:cleanup', 'db:migrate'], () => {
  return gulp.src(['test/**/*.js'])
  .pipe(mocha({
    reporter: 'spec'
  }));
})

gulp.task('test:lint', () => {
  return gulp.src(['index.js', 'gulpfile.js', 'app/**/*.js', 'test/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});
//Test tasks-----------------------------


//DB Tasks-------------------------------
gulp.task('db:migrate', (done) => {
  exec(MODULES_BIN + '/sequelize db:migrate', (err, stdout, stderr) => {
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
    console.log('reloading');
    server.start();
    server.notify(file);
  });
});
//Exec Tasks-----------------------------


//Exports to Gulp------------------------
gulp.task('test', ['test:env', 'test:lint', 'test:run']);

gulp.task('run', ['db:migrate', 'exec:express']);
//Exports to Gulp------------------------