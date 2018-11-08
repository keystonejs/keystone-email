var assign = require('object-assign');

var getRecipientsAndVars = require('../mailgun/getRecipientsAndVars');
var processAddress = require('../../util/processAddress');

var defaultOptions = {
	apiKey: process.env.AWS_SES_API_KEY,
	apiSecret: process.env.AWS_SES_SECRET_KEY,
	region: process.env.AWS_SES_REGION || 'us-east-1',
};

function getSendOptions (options) {
	// default options
	options = assign({ Destination: {} }, defaultOptions, options);
	// process from name and email
	options.Source = processAddress(options.from).address;
	// process recipients, including cc and bcc
	options.Destination.ToAddresses = getRecipientsAndVars(options.to).recipients;
	// handle cc
	if (options.cc && options.cc.length > 0) {
		options.Destination.CcAddresses = getRecipientsAndVars(options.cc).recipients;
	}
	// handle bcc
	if (options.bcc && options.bcc.length > 0) {
		options.Destination.BccAddresses = getRecipientsAndVars(options.bcc).recipients;
	}
	// return
	return options;
}

module.exports = getSendOptions;
