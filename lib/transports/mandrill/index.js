var assign = require('object-assign');
var mandrill = require('mandrill-api/mandrill');

var getSendOptions = require('./getSendOptions');

function send (email, options, callback) {
	options = assign(getSendOptions(options), email);
	// validate
	// This wording means a single email to an email object will fail
	// console.log('options for checking', options);
	options.merge_vars.forEach(vars => {
		console.log('our merge vars', vars);
	});
	if (!options.to.length) {
		return callback(new Error('No recipients to send to'));
	}
	// init client
	var client = new mandrill.Mandrill(options.apiKey);
	delete options.apiKey;
	// send

	client.messages.send(
		{ message: options },
		function (res) { callback(null, res); }, // onSuccess
		function (res) { callback(res); } // onError
	);
}

module.exports = send;
