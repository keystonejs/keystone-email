var assign = require('object-assign');

var getRecipientsAndMergeVars = require('./getRecipientsAndMergeVars');
var objToMandrillVars = require('./objToMandrillVars');
var truthy = require('../../util/truthy');

var defaultOptions = {
	apiKey: process.env.MANDRILL_API_KEY,
	async: true,
	inline_css: true,
	preserve_recipients: false,
	subject: '',
	track_clicks: true,
	track_opens: true,
};

function getSendOptions (options) {
	// default options
	options = assign({}, defaultOptions, options);
	// parse from name and email into options
	var fromName = options.from_name;
	var fromEmail = options.from_email;
	if (typeof options.from === 'string') {
		fromEmail = options.from;
	} else if (typeof options.from === 'object') {
		fromName = options.from.name;
		fromEmail = options.from.email;
	}
	if (typeof fromName === 'object') {
		fromName = [fromName.first, fromName.last].filter(truthy).join(' ');
	}
	options.from_name = fromName;
	options.from_email = fromEmail;
	delete options.from;
	// process global merge vars
	if (options.globalMergeVars) {
		options.global_merge_vars = (options.global_merge_vars || [])
			.concat(objToMandrillVars(options.globalMergeVars));
	}
	delete options.globalMergeVars;
	// process recipients and mergeVars
	var recipientsAndMergeVars = getRecipientsAndMergeVars(options.to);
	options.to = recipientsAndMergeVars.recipients;
	options.merge_vars = recipientsAndMergeVars.mergeVars;
	// return
	return options;
}

module.exports = getSendOptions;
