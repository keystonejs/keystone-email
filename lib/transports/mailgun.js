var assign = require('assign');
var juice = require('juice');
var mailgun = require('mailgun-js');

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
	// inline css
	if (options.inlineCSS) {
		options.html = juice(options.html);
	}
	delete options.inlineCSS;
	client.messages().send(options, callback);
}

module.exports = send;
