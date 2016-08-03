/*
This file sends an email with a test template to an email address.

Usage:
	TO=user@keystonejs.com MAILGUN_API_KEY=xyz MAILGUN_DOMAIN=abc TEMPLATE=simple node test-send
*/

var Email = require('./index');

var template = process.env.TEMPLATE;
var to = process.env.TO;

var mailgunApiKey = process.env.MAILGUN_API_KEY;
var mailgunDomain = process.env.MAILGUN_DOMAIN;
var mandrillApiKey = process.env.MANDRILL_API_KEY;

if (!mandrillApiKey && (!mailgunApiKey || !mailgunDomain)) {
	throw Error('You must provide either or both Mailgun or Mandrill auth');
}

var templateOptions = require('./tests/emails/' + template + '/options');
var templatePath = './tests/emails/' + template + '/template.pug';

if (mailgunApiKey) {
	Email.send(
		// template path
		templatePath,
		// Email options
		{
			transport: 'mailgun',
		},
		// Template locals
		templateOptions,
		// Send options
		{
			to: to,
			from: { name: 'Test', email: 'user@keystonejs.com' },
			apiKey: mailgunApiKey,
			domain: mailgunDomain,
		},
		// callback
		function (err, result) {
			if (err) console.error('there was an error', err);
			if (result) console.log('our result was', result);
		}
	);
}

if (mandrillApiKey) {
	Email.send(
		// template path
		templatePath,
		// Email options
		{
			transport: 'mandrill',
		},
		// Template locals
		templateOptions,
		// Send options
		{
			to: to,
			from: { name: 'Test', email: 'user@keystonejs.com' },
			apiKey: mandrillApiKey,
		},
		// callback
		function (err, result) {
			if (err) console.error('there was an error', err, err.stack);
			if (result) console.log('our result was', result);
		}
	);
}
