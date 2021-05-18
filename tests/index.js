/* eslint-env node, mocha */
var assert = require('assert');
var testEmail = 'user@keystone.com';
var testName = 'user person';
var testAddress = 'user person <user@keystone.com>';
var nameObj = { first: 'user', last: 'person' };

describe('utils', function () {
	describe('clean HTML', function () {
		var cleanHTML = require('../lib/util/cleanHTML');
		var safeString = 'I am the very model of a modern major general.';
		var unsafeString = '<unsafe" OF ".  string>=&#$?|\\';

		it('should return the same string as entered if it was safe', function () {
			var res = cleanHTML(safeString);
			assert.equal(safeString, res);

		});
		it.skip('should replace <>#$/\ and quotations with safe characters', function () {
			var res = cleanHTML(unsafeString);
			console.log(res);
			assert.notEqual(res, unsafeString);
		});
	});

	describe('get engine', function () {
		var getEngine = require('../lib/util/getEngine');
		it('should return the named engine if it is installed', function () {
			var res = getEngine('pug');
			assert(typeof res, 'function');
		});
		it('should return html engine if is requested', function () {
			var res = getEngine('html');
			assert(typeof res, 'function');
		});
		it('should throw if engine cannot be found', function () {
			assert.throws(function () {
				getEngine('watermelon');
			}, Error);
		});
	});

	describe('get transport', function () {
		var getTransport = require('../lib/util/getTransport');

		it('should throw if no transport was found', function () {
			assert.throws(function () {
				getTransport('watermelon');
			}, 'Could not load transport (watermelon)');
		});
		it('should return transport if transport is found', function () {
			var res1 = getTransport('mailgun');
			var res2 = getTransport('mandrill');
			var res3 = getTransport('awsses');
			assert.equal(typeof res1, 'function');
			assert.equal(typeof res2, 'function');
			assert.equal(typeof res3, 'function');
		});
	});

	describe('is file', function () {
		it('');
	});

	describe('is truthy', function () {
		it('');
	});

	describe('processAddress', function () {
		var processAddress = require('../lib/util/processAddress');

		it('should set a string provided to both the address and the email', function () {
			var res = processAddress(testEmail);
			assert.equal(res.email, testEmail);
			assert.equal(res.address, testEmail);
		});

		it('should process an object with a name and an email', function () {
			var singlesObj = { email: testEmail, name: testName };
			var res = processAddress(singlesObj);
			assert.equal(res.email, testEmail);
			assert.equal(res.address, testAddress);
		});
		it('should process an object that includes a name object', function () {
			var multiObj = { email: testEmail, name: nameObj };
			var res = processAddress(multiObj);
			assert.equal(res.email, testEmail);
			assert.equal(res.address, testAddress);
			assert.equal(res.firstName, nameObj.first);
			assert.equal(res.lastName, nameObj.last);
		});
		it('should do something if given an empty object');
		// TODO: Behaviours if the object is the wrong shape? Does not include email,
		// name only has name.first etc etc
	});
});

describe('mailgun transport', function () {
	describe('get recipients and vars', function () {
		var getRecipientsAndVars = require('../lib/transports/mailgun/getRecipientsAndVars');
		it('return an object with recipients and vars', function () {
			var res = getRecipientsAndVars();
			console.log('our response', res);
			assert(Array.isArray(res.recipients));
			assert.equal(typeof res.vars, 'object');
		});
		it('does not add data to vars or recipients if there is no address');
		it('pushes all addresses of "to" into recipients');
		it('moves variables from "to" object to the variables');
		// Currently rcpt.firstName and rcpt.lastName are not guaranteed to exist
		it('adds name, email, firstName and lastName of the parse "to" object to the var');
	});

	describe('index function', function () {
		// var mailgun = require('../lib/transports/mailgun');
		it('sends an email to a single recipient');
		it('returns an error if there is no recipient');
		it('uses default options for apiKey, domain, inlineCSS and o:tracking if they are not provided');
		it('does not pass apiKey or domain on with options');
		it('applies css styles');
	});
});

describe('mandrill transport', function () {
	describe('objToMandrillVars', function () {
		// Should this throw if it is not an object and not an array,
		// instead of returning?
		it('should return the var if it is not an object');
		it('should return an array if an object was passed in');
		it('Each item in a flattened array should have a name and a content property');
		it('should return an array where each item has a name and content');
	});

	describe('get recipients and vars', function () {
		it('should return recipients and mergeVars as empty arrays if "to" is not an array');
		it('should convert strings in "to" into objects with an email property of the string');
		it('should not return an item to vars or recipients for an empty object');
		it('should add a new entry to vars with the email if there is an email');
		it('should add a new entry to vars with the name if there is a name string');
		it('should split up a name object, and push name, first_name and last_name to vars');
	});

	describe('index function', function () {
		it('');
	});
});

describe('nodemailer transport', function () {
	describe('get recipients', function () {
		// var getRecipients = require('../lib/transports/nodemailer/getRecipients');
		it('');
	});

	describe('index function', function () {
		it('');
	});
});

// describe('render method');
// describe('getSendOptions for mailgun');
// describe('getSendOptions for mandrill');


describe('email sending', function () {
	var Email = require('../lib/Email');
	it('should import Email constructor', function () {
		assert.equal(typeof Email, 'function');
	});

	it('should make us a constructor from pug template', function () {
		var template = new Email('./tests/emails/simple/template.pug');
		assert.equal(template.ext, '.pug');
		assert.equal(typeof template.engine, 'function');
		assert.equal(typeof template.template, 'string');
	});
	it('should make us a constructor from html template', function () {
		var template = new Email('./tests/emails/simple/html.html');
		assert.equal(template.ext, '.html');
		assert.equal(typeof template.engine, 'function');
		assert.equal(typeof template.template, 'string');
	});
	it.skip('should make us a constructor from txt template', function () {
		var template = new Email('./tests/emails/simple/text.txt');
		assert.equal(template.ext, '.txt');
		assert.equal(typeof template.engine, 'function');
		assert.equal(typeof template.template, 'string');
	});

	it('should accept an engine to set the template ext', function () {
		var template = new Email('./tests/emails/simple/template', { engine: 'pug' });
		assert.equal(template.ext, '.pug');
	});
	it('should accept an engine to set the template ext', function () {
		var template = new Email('./tests/emails/simple/template.pug', { engine: 'pug' });
		assert.equal(template.ext, '.pug');
	});
	it('should allow engine option to be a function', function () {
		var template = new Email('./tests/emails/simple/template.pug', { engine: function () {
			return 'Hello Chums';
		} });
		assert.equal(template.ext, '.pug');
		assert.equal(template.engine(), 'Hello Chums');
	});

	it('should error if no template is provided in the option', function () {
		assert.throws(function () {
			Email();
		});
	});

	it('should use mailgun transport is passed as option', function () {
		var template = new Email('./tests/emails/simple/template.pug', { transport: 'mailgun' });
		assert.equal(typeof template.transport, 'function');
	});
	it('should use mandrill transport is passed as option', function () {
		var template = new Email('./tests/emails/simple/template.pug', { transport: 'mandrill' });
		assert.equal(typeof template.transport, 'function');
	});

	describe('render', function () {
		it('should return an error in the callback if it is unable to render from template', function () {
			var template = new Email('./tests/emails/simple/template.pug', { transport: 'mandrill' });
			delete template.template;
			template.render(function (err, info) {
				assert(err);
			});
		});
		it('should return and object with property "html" as second argument in callback that is accurate to the template', function () {
			var template = new Email('./tests/emails/simple/template.pug', { transport: 'mandrill' });
			template.render(function (err, info) {
				assert.equal(typeof info.html, 'string');
			});
		});
		it('should return and object with property "text" as second argument in callback that is accurate to the template', function () {
			var template = new Email('./tests/emails/simple/template.pug', { transport: 'mandrill' });
			template.render(function (err, info) {
				assert.equal(typeof info.text, 'string');
			});
		});
		it('render accepts variable objects and adds them to template', function () {
			var template = new Email('./tests/emails/simple/template.pug', { transport: 'mandrill' });
			template.render({ variable: 'chocolate' }, function (err, info) {
				assert(info.html.indexOf('chocolate') >= 0, 'variable not found in parsed template');
				assert(info.text.indexOf('chocolate') >= 0, 'variable not found in parsed template');
			});
		});
	});

	describe('from option', function () {
		it('should accept a string');
		it('should accept an object with an email and name property');
		it('should accept an object with an email property as string and name property as string');
		it('should not accept an object with an email property as string and no name property');
		it('should not accept an object with no email property');
		it('should accept an object with an email propertyand name property as an object with first and last');
		it('should not accept an object with an email propertyand name property as an object with first and not last');
		it('should not accept an object with an email propertyand name property as an object with last and not first');
	});

	describe('to option', function () {
		it('should accept a string as an argument');
		it('should accept an object with an email and name property');
		it('should accept an object with vars property for recipient-unique template changes');
		it('should accept an array of recipients in any valid recipient format');
		it('should not accept an array of recipients in varied valid formats');
	});

	describe('send function', function () {
		it('should deliver mail to us');
	});


	// Things to test:
	// Email function
	// prototype functions:
	// render
	// resolve
	// send
});
