var assign = require('object-assign');
var juice = require('juice');

var getRecipientsAndVars = require('./getRecipientsAndVars');
var processAddress = require('./processAddress');

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
	// inline css
	if (options.inlineCSS) {
		options.html = juice(options.html);
	}
	delete options.inlineCSS;
	// return
	return options;
}

module.exports = getSendOptions;
