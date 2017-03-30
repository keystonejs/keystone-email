var requireOptional = require('../../util/requireOptional');
var assign = require('object-assign');
var aws = requireOptional('aws-sdk', 'Please install the aws-sdk package to use this transport');
var juice = require('juice');
var getSendOptions = require('./getSendOptions');

function send (email, options, callback) {
	// init options
	options = assign({ Message: { Subject: {}, Body: { Html: {} } } }, getSendOptions(options), email);

	// validate
	if (!options.Destination.ToAddresses.length) {
		return callback(new Error('No recipients to send to'));
	}

	// handle html body
	options.Message.Body.Html.Data = options.inlineCSS ? juice(options.html) : options.html;

	// add subject
	if (options.subject) {
		options.Message.Subject.Data = options.subject;
	}

	// init aws
	aws.config.accessKeyId = options.apiKey;
	aws.config.secretAccessKey = options.apiSecret;
	aws.config.region = options.region;

	// init ses
	var ses = new aws.SES({ apiVersion: '2010-12-01' });

	// send emails
	ses.sendEmail({
		Message: options.Message,
		Destination: options.Destination,
		Source: options.Source,
	}, callback);
}

module.exports = send;
