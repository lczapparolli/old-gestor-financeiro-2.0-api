const MODULES_BIN = 'node_modules/.bin/';

const gulp = require('gulp');
const exec = require('child_process').exec;
const del = require('del');

//Test tasks-----------------------------
const testEnv = (done) => {
  process.env.NODE_ENV = 'test';
  done();
};
testEnv.displayName = 'Set test environment';
//Test tasks-----------------------------


//DB Tasks-------------------------------
const dbMigrate = (done) => {
  exec(MODULES_BIN + '/sequelize db:migrate', (err, stdout, stderr) => {
    done(err);
  });
};
dbMigrate.displayName = 'Database migration';

const dbCleanup = () => {
  var env = process.env.NODE_ENV || 'development';
  return del('db/' + env + '.sqlite3');
};
dbCleanup.displayName = 'Clean database';
//DB Tasks-------------------------------


//Final tasks----------------------------
const test = gulp.series(testEnv, dbCleanup, dbMigrate);
test.description = 'Check database scripts and execute unit tests';
//Final tasks----------------------------


//Exports to Gulp------------------------
gulp.task('test', test);
//Exports to Gulp------------------------