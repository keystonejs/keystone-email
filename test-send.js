/*
This file sends an email with a test template to an email address.

Usage:
	TO=user@keystonejs.com MAILGUN_API_KEY=xyz MAILGUN_DOMAIN=abc TEMPLATE=simple node test-send
For usage with nodemailer specify your transport config and auth in test.config.js, and then run:
	TO=user@keystonejs.com TEST_NODEMAILER=true node test-send
*/

var Email = require('./index');

var template = process.env.TEMPLATE;
var to = process.env.TO;

var mailgunApiKey = process.env.MAILGUN_API_KEY;
var mailgunDomain = process.env.MAILGUN_DOMAIN;
var mandrillApiKey = process.env.MANDRILL_API_KEY;
var testNodeMailer = process.env.TEST_NODEMAILER === 'true';

if (testNodeMailer) {
	var nodemailerConfig = require('./test.config.js');
}

if (!mandrillApiKey && (!mailgunApiKey || !mailgunDomain) && (testNodeMailer && !nodemailerConfig)) {
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
