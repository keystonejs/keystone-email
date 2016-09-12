var assign = require('object-assign');
var nodemailer = require('nodemailer');
var juice = require('juice');
var getSendOptions = require('./getSendOptions');

function send (email, options, callback) {
	// init options
	options = assign(getSendOptions(options), email);
	// validate
	if (!options.nodemailerConfig) {
		return callback(new Error('No Nodemailer config'));
	}
	if (!options.to.length) {
		return callback(new Error('No recipients to send to'));
	}
	// inline css
	if (options.inlineCSS) {
		options.html = juice(options.html);
	}
	delete options.inlineCSS;
	// init transporter
	var transporter = nodemailer.createTransport(options.nodemailerConfig);
	delete options.nodemailerConfig;
	// send emails
	transporter.sendMail(options, callback);
}

module.exports = send;
