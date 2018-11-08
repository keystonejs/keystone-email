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

	// init ses
	var ses = new aws.SES({ 
		apiVersion: '2010-12-01',
		accessKeyId: options.apiKey,
		secretAccessKey: options.secretAccessKey,
		region: options.region 
	});

	var params = {
		Message: options.Message,
		Destination: options.Destination,
		Source: options.Source,
	};

	// add reply-to
	if (options.ReplyToAddresses) {
		params.ReplyToAddresses = options.ReplyToAddresses
	}

	// send emails
	ses.sendEmail(params, callback);
}

module.exports = send;
