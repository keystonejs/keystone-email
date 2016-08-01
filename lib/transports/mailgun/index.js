var assign = require('assign');
var juice = require('juice');
var mailgun = require('mailgun-js');

var getRecipientsAndVars = require('./getRecipientsAndVars');
var processAddress = require('./processAddress');

var defaultOptions = {
	'apiKey': process.env.MAILGUN_API_KEY,
	'domain': process.env.MAILGUN_DOMAIN,
	'inlineCSS': true,
	'o:tracking': true,
};

function send (email, options, callback) {
	// init options and client
	options = assign({}, defaultOptions, options, email);
	var client = mailgun({
		apiKey: options.apiKey,
		domain: options.domain,
	});
	delete options.apiKey;
	delete options.domain;
	// process from name and email
	options.from = processAddress(options.from).address;
	// process recipients and variables
	var recipientsAndVars = getRecipientsAndVars(options.to, options['recipient-variables']);
	options.to = recipientsAndVars.recipients;
	options['recipient-variables'] = recipientsAndVars.vars;
	// validate
	if (!options.to.length) {
		return callback(new Error('No recipients to send to'));
	}
	// inline css
	if (options.inlineCSS) {
		options.html = juice(options.html);
	}
	delete options.inlineCSS;
	client.messages().send(options, callback);
}

module.exports = send;
