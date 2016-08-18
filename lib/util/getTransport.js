var transports = {};

// NOTE (BC) - Options passed in here is not currently doing anything
function getTransport (name, options) {
	name = ('' + name).toLowerCase();
	if (!transports[name]) {
		try {
			transports[name] = require('../transports/' + name);
		} catch (e) {
			throw new Error('Could not load transport (' + name + ')');
		}
	}
	return transports[name];
}

module.exports = getTransport;
