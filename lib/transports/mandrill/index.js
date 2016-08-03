var assign = require('object-assign');
var mandrill = require('mandrill-api/mandrill');

var getSendOptions = require('./getSendOptions');

function send (email, options, callback) {
	options = assign(getSendOptions(options), email);
	// validate
	if (!options.to.length) {
		return callback(new Error('No recipients to send to'));
	}
	// init client
	var client = new mandrill.Mandrill(options.apiKey);
	delete options.apiKey;
	// send
	client.messages.send(
		{ message: options },
		// onSuccess
		function (res) { callback(null, res); },
		// onError
		function (res) {
			callback(res);
		}
	);
}

module.exports = send;
