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

	it('should make us a template', function () {
		let template = new Email('email.pug');
		console.log('template is', template);
		assert.equal(1, 3);
	});

	// Things to test:
	// Email function
	// prototype functions:
	// render
	// resolve
	// send

});
