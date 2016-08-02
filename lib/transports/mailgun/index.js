var assign = require('object-assign');
var mailgun = require('mailgun-js');

var getSendOptions = require('./getRecipientsAndVars');

function send (email, options, callback) {
	// init options
	options = assign(getSendOptions(options), email);
	// validate
	if (!options.to.length) {
		return callback(new Error('No recipients to send to'));
	}
	// init client
	var client = mailgun({
		apiKey: options.apiKey,
		domain: options.domain,
	});
	delete options.apiKey;
	delete options.domain;
	// send emails
	client.messages().send(options, callback);
}

module.exports = send;
