/* eslint-env node, mocha */
const assert = require('assert');
const testEmail = 'user@keystone.com';
const testName = 'user person';
const testAddress = 'user person <user@keystone.com>';
const nameObj = { first: 'user', last: 'person' };


describe('will run something', function () {
	it('will ensure 1 equals 1', function () {
		assert.equals(1, 1);
	});
});


describe('utils', function () {
	describe('clean HTML', function () {
		let cleanHTML = require('../lib/util/cleanHTML');
		let safeString = 'I am the very model of a modern major general.';
		let unsafeString = '<unsafe" OF ".  string>=&#$?|\\';

		it('should return the same string as entered if it was safe', function () {
			let res = cleanHTML(safeString);
			assert.equal(safeString, res);

		});
		it('should replace <>#$/\ and quotations with safe characters', function () {
			let res = cleanHTML(unsafeString);
			console.log(res);
			assert.notEqual(res, unsafeString);
		});
	});

	describe('get engine', function () {
		let getEngine = require('../lib/util/getEngine');
		it('should return the named engine if it is installed', function () {
			let res = getEngine('pug');
			assert(typeof res, 'function');
		});
		it('should return html engine if is requested', function () {
			let res = getEngine('html');
			assert(typeof res, 'function');
		});
		it('should throw if engine cannot be found', function () {
			assert.throws(() => {
				getEngine('watermelon');
			}, Error);
		});
	});

	describe('get transport', function () {
		let getTransport = require('../lib/util/getTransport');

		it('should throw if no transport was found', function () {
			assert.throws(() => {
				getTransport('watermelon');
			}, 'Could not load transport (watermelon)');
		});
		it('should return transport if transport is found', function () {
			let res1 = getTransport('mailgun');
			// let res2 = getTransport('mandrill');
			assert.equal(typeof res1, 'function');
			// assert.equal(typeof res2, 'function');
		});
	});
	describe('is file', function () {
		it('');
	});
	describe('is truthy', function () {
		it('');
	});
});

describe('mailgun transport', function () {

	describe('processAddress', function () {
		let processAddress = require('../lib/transports/mailgun/processAddress');

		it('should set a string provided to both the address and the email', function () {
			let res = processAddress(testEmail);
			assert.equal(res.email, testEmail);
			assert.equal(res.address, testEmail);
		});

		it('should process an object with a name and an email', function () {
			let singlesObj = { email: testEmail, name: testName };
			let res = processAddress(singlesObj);
			assert.equal(res.email, testEmail);
			assert.equal(res.address, testAddress);
		});
		it('should process an object that includes a name object', function () {
			let multiObj = { email: testEmail, name: nameObj };
			let res = processAddress(multiObj);
			assert.equal(res.email, testEmail);
			assert.equal(res.address, testAddress);
			assert.equal(res.firstName, nameObj.first);
			assert.equal(res.lastName, nameObj.last);
		});
		it('should do something if given an empty object');
		// TODO: Behaviours if the object is the wrong shape? Does not include email,
		// name only has name.first etc etc
	});

	describe('get recipients and vars', function () {
		let getRecipientsAndVars = require('../lib/transports/mailgun/getRecipientsAndVars');
		it('return an object with recipients and vars', function () {
			let res = getRecipientsAndVars();
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
		// let mailgun = require('../lib/transports/mailgun');
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
		it();
	});
});


describe('email sending', function () {
	let Email = require('../lib/Email');
	it('should import Email constructor', function () {
		assert.equal(typeof Email, 'function');
	});

	it('should make us a constructor', function () {
		let template = new Email('email.pug');
		console.log('template is', template);
		assert.equal(1, 3);
	});

	it('should export from a template file');
	it('should be able to have your template format vary');

	it('should error if no transport is provided in the option');
	it('should create new Email if mailgun transport is passed as option');
	it('should create new Email if mandrill transport is passed as option');
	it('should create new Email if transport: function () is passed as option');

	describe('render', function () {
		it('should return an error in the callback if it is unable to render from template');
		it('should return and object with property "html" as second argument in callback that is accurate to the template');
		it('should return and object with property "text" as second argument in callback that is accurate to the template');
		it('should fill out the template from a locals object as the first argument');
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

	// describe('send with mailgun', function () {
	// 	// Is from required?
	// 	// Is to require? What does it do if it does not have these?
	// 	it.skip('should use default option values if none are provided', function () {
	// 		assert.equal(apiKey, process.env.MAILGUN_API_KEY);
	// 		assert.equal(domain, process.env.MAILGUN_DOMAIN);
	// 		assert.strictEqual(inlineCSS, true);
	// 		// assert.strictEqual(o:tracking, true);
	// 	});
	// 	it('should use values provided if values are provided');
	// 	it('should merge recipient variables and other variables');
	// });
	//
	// describe('send with mandrill', function () {
	// 	it.skip('should use default values', function () {
	// 		assert.equal(apiKey, process.env.MANDRILL_API_KEY);
	// 		assert.strictEqual(async, true);
	// 		// is globalMergeVars required? Does it default?
	// 		assert.strictEqual(inlineCSS, true);
	// 		assert.strictEqual(preserve_recipients, false);
	// 		assert.strictEqual(track_clicks, true);
	// 		assert.strictEqual(track_opens, true);
	// 	});
	// 	it('should use values provided if values are provided');
	// });

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
