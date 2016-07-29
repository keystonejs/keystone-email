var assign = require('assign');
var juice = require('juice');
var mailgun = require('mailgun-js');

var defaultOptions = {
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN,
	inlineCSS: true,
};

function send (email, options, callback) {
	options = assign({}, defaultOptions, options, email);
	// Init the client
	var client = mailgun({
		apiKey: options.apiKey,
		domain: options.domain,
	});
	delete options.apiKey;
	delete options.domain;
	// Inline CSS
	if (options.inlineCSS) {
		options.html = juice(options.html);
	}
	delete options.inlineCSS;
	// TODO: Validate options (from, to, subject, etc)
	client.messages().send(options, callback);
}

module.exports = send;
