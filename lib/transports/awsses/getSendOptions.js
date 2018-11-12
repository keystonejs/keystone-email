var assign = require('object-assign');

var getRecipients = require('./getRecipients');
var processAddress = require('../../util/processAddress');

var defaultOptions = {
	apiKey: process.env.AWS_SES_API_KEY,
	apiSecret: process.env.AWS_SES_SECRET_KEY,
	region: process.env.AWS_SES_REGION || 'us-east-1',
};

function getSendOptions(options) {
	// default options
	options = assign({ Destination: {} }, defaultOptions, options);
	// process from name and email
	options.Source = processAddress(options.from).address;
	// process recipients, including cc and bcc
	options.Destination.ToAddresses = getRecipients(options.to);
	// handle cc
	if (options.cc && options.cc.length > 0) {
		options.Destination.CcAddresses = getRecipients(options.cc);
	}
	// handle bcc
	if (options.bcc && options.bcc.length > 0) {
		options.Destination.BccAddresses = getRecipients(options.bcc);
	}
	// handle reply-to
	if (options.replyTo && options.replyTo.length > 0) {
		options.ReplyToAddresses = getRecipients(options.replyTo);
	}
	// return
	return options;
}

module.exports = getSendOptions;
