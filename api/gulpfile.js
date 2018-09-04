const MODULES_BIN = 'node_modules/.bin/';

const gulp = require('gulp');
const exec = require('child_process').exec;
const del = require('del');
const nodemon = require('gulp-nodemon');

//Test tasks-----------------------------
gulp.task('test:env', (done) => {
  process.env.NODE_ENV = 'test';
  done();
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
gulp.task('exec:express', ['db:migrate'], (done) => {
  var server = nodemon({
    watch: ['index.js', 'app/**/*.js', 'db/config.json'],
    done: done
  });

  server.on('quit', () => {
    done();
  });
});
//Exec Tasks-----------------------------


//Exports to Gulp------------------------
gulp.task('test', ['test:env', 'db:migrate', 'db:cleanup']);

gulp.task('run', ['db:migrate', 'exec:express']);
//Exports to Gulp------------------------