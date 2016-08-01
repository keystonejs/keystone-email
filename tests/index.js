/* eslint-env node, mocha */
const assert = require('assert');
const singleEmail = 'user@keystone.com';
const singleName = 'user person';
const emailAndName = 'user person <user@keystone.com>';
const emailArray = ['user@keystone.com', 'people@keystone.com', 'friends@keystone.com'];
const nameArray = ['user person', 'community', 'such people'];
const joinedArray = ['user person <user@keystone.com>', 'community <people@keystone.com>', 'such people <friends@keystone.com>'];
const ourUndefined = undefined;

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

	describe('send with mailgun', function () {
		// Is from required?
		// Is to require? What does it do if it does not have these?
		it.skip('should use default option values if none are provided', function () {
			assert.equal(apiKey, process.env.MAILGUN_API_KEY);
			assert.equal(domain, process.env.MAILGUN_DOMAIN);
			assert.strictEqual(inlineCSS, true);
			// assert.strictEqual(o:tracking, true);
		});
		it('should use values provided if values are provided');
		it('should merge recipient variables and other variables');
	});

	describe('send with mandrill', function () {
		it.skip('should use default values', function () {
			assert.equal(apiKey, process.env.MANDRILL_API_KEY);
			assert.strictEqual(async, true);
			// is globalMergeVars required? Does it default?
			assert.strictEqual(inlineCSS, true);
			assert.strictEqual(preserve_recipients, false);
			assert.strictEqual(track_clicks, true);
			assert.strictEqual(track_opens, true);
		});
		it('should use values provided if values are provided');
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
