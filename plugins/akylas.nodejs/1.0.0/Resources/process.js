/* global Ti:true, Titanium:true */

var process = module.exports = new (require('events').EventEmitter)();

process.nextTick = function nextTick(fn) {
  setTimeout(fn, 0);
};

process.title = 'titanium';
process.version = 'undefined';
process.titanium = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.umask = function () {
  return 0;
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.stdout = {};
process.stderr = {};

process.stdout.write = function (msg) {
  console.log(msg);
};

process.stderr.write = function (msg) {
  console.error(msg);
};
