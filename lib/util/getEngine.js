var engines = {
	html: function (html, options, callback) {
		return callback(null, html);
	},
};

function getEngine (name) {
	if (typeof name === 'function') return name;
	if (!engines[name]) {
		try {
			engines[name] = require(name).__express;
		} catch (e) {
			throw new Error('Could not load engine (' + name + '). Please make sure '
				+ 'you have installed the package in your project.');
		}
	}
	return engines[name];
}

module.exports = getEngine;
