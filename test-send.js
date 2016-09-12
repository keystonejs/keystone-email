/*
This file sends an email with a test template to an email address.

Usage:
	TO=user@keystonejs.com MAILGUN_API_KEY=xyz MAILGUN_DOMAIN=abc TEMPLATE=simple node test-send

For usage with Nodemailer you must first provide a test.config.js.
Different transports can be specified and configured there, e.g SMTP:
	module.exports = {
		host: 'xyz',
		port: 'abc',
		auth: {
			user: 'xyz',
			pass: 'abc',
		},
	};
then run
	TO=user@keystonejs.com node test-send
*/

var Email = require('./index');

var template = process.env.TEMPLATE;
var to = process.env.TO;

var mailgunApiKey = process.env.MAILGUN_API_KEY;
var mailgunDomain = process.env.MAILGUN_DOMAIN;
var mandrillApiKey = process.env.MANDRILL_API_KEY;

var nodemailerConfig = require('./test.config.js');

if (!mandrillApiKey && (!mailgunApiKey || !mailgunDomain) && !nodemailerConfig) {
	throw Error('You must provide at least one auth config');
}

// default to simple template
if (!template) {
	template = 'simple';
}

var templateOptions = require('./tests/emails/' + template + '/options');
var templatePath = './tests/emails/' + template + '/template.pug';

var toArray = [
	to,
	{ name: 'Test Recipient', email: to.split('@').join('+1@'), vars: { testVar: 'Our test variable' } },
	{ name: { first: 'Test First', last: 'Test Last' }, email: to.split('@').join('+2@') },
];

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
			to: toArray,
			subject: 'Why hello there! ... from keystone-email ' + Date.now(),
			from: { name: 'Test', email: 'user@keystonejs.com' },
			apiKey: mailgunApiKey,
			domain: mailgunDomain,
		},
		// callback
		function (err, result) {
			if (err) {
				console.error('🤕 Mailgun test failed with error:\n', err);
			} else {
				console.log('📬 Successfully sent Mailgun test with result:\n', result);
			}
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
			to: toArray,
			subject: 'Why hello there! ... from keystone-email ' + Date.now(),
			from: { name: 'Test', email: 'user@keystonejs.com' },
			apiKey: mandrillApiKey,
		},
		// callback
		function (err, result) {
			if (err) {
				console.error('🤕 Mandrill test failed with error:\n', err);
			} else {
				console.log('📬 Successfully sent Mandrill test with result:\n', result);
			}
		}
	);
}

if (nodemailerConfig) {
	Email.send(
		// template path
		templatePath,
		// Email options
		{
			transport: 'nodemailer',
		},
		// Template locals
		templateOptions,
		// Send options
		{
			to: toArray,
			subject: 'Why hello there! ... from keystone-email ' + Date.now(),
			from: { name: 'Test', email: 'user@keystonejs.com' },
			nodemailerConfig: nodemailerConfig,
		},
		// callback
		function (err, result) {
			if (err) {
				console.error('🤕 Nodemailer test failed with error:\n', err);
			} else {
				console.log('📬 Successfully sent Nodemailer test with result:\n', result);
			}
		}
	);
}
