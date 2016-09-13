module.exports = function (pkg, msg) {
	try {
		return require('pkg');
	} catch (e) {
		if (e.code === 'MODULE_NOT_FOUND') {
			throw new Error(msg);
		} else {
			throw e;
		}
	}
};
