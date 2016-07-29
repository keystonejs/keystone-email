var debug = require('debug')('keystone:email');
var fs = require('fs');

function isFile (path) {
	debug('isFile "%s"', path);
	try {
		var stat = fs.statSync(path);
		return stat.isFile();
	} catch (e) {
		return false;
	}
}

module.exports = isFile;
