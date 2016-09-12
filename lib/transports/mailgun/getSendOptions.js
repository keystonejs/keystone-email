var assign = require('object-assign');

var getRecipientsAndVars = require('./getRecipientsAndVars');
var processAddress = require('../../util/processAddress');

var defaultOptions = {
	'apiKey': process.env.MAILGUN_API_KEY,
	'domain': process.env.MAILGUN_DOMAIN,
	'inlineCSS': true,
	'o:tracking': true,
};

function getSendOptions (options) {
	// default options
	options = assign({}, defaultOptions, options);
	// process from name and email
	options.from = processAddress(options.from).address;
	// process recipients and variables
	var recipientsAndVars = getRecipientsAndVars(options.to, options['recipient-variables']);
	options.to = recipientsAndVars.recipients;
	options['recipient-variables'] = recipientsAndVars.vars;
	// return
	return options;
}

module.exports = getSendOptions;
