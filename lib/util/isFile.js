var debug = require('debug')('keystone:email');
var fs = require('fs');

var cache = {};

function isFile (path) {
	if (cache[path] !== undefined) {
		return cache[path];
	}
	debug('isFile "%s"', path);
	try {
		var stat = fs.statSync(path);
		cache[path] = stat.isFile();
	} catch (e) {
		cache[path] = false;
	}
	return cache[path];
}

module.exports = isFile;
