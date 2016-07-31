var assign = require('assign');
var juice = require('juice');
var mailgun = require('mailgun-js');

var processAddress = require('../util/processAddress');

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
	var rcptVars = options['recipient-variables'] || {};
	var recipients = [];
	(Array.isArray(options.to) ? options.to : [options.to]).forEach(function (i) {
		var rcpt = processAddress(i);
		if (!rcpt.address) return;
		recipients.push(rcpt.address);
		if (!rcptVars[rcpt.email]) {
			rcptVars[rcpt.email] = {};
		}
		if (typeof i === 'object' && i.vars) {
			assign(rcptVars[rcpt.email], i.vars);
		}
		if (!rcptVars[rcpt.email].name) rcptVars[rcpt.email].name = rcpt.name;
		if (!rcptVars[rcpt.email].email) rcptVars[rcpt.email].email = rcpt.email;
		if (!rcptVars[rcpt.email].firstName) rcptVars[rcpt.email].firstName = rcpt.firstName;
		if (!rcptVars[rcpt.email].lastName) rcptVars[rcpt.email].lastName = rcpt.lastName;
	});
	options.to = recipients;
	options['recipient-variables'] = rcptVars;
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
