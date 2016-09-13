var assign = require('object-assign');

var processAddress = require('../../util/processAddress');
var getRecipients = require('./getRecipients');

var defaultOptions = {
	inlineCSS: true,
};

function getSendOptions (options) {
	// default options
	options = assign({}, defaultOptions, options);
	// process from name and email
	options.from = processAddress(options.from);
	// process recipients
	options.to = getRecipients(options.to);
	// process attachments, TODO needs testing
	if (options.attachments) {
		options.attachments = options.attachments.map(function (attachment) {
			return {
				cid: attachment.cid,
				filename: attachment.name,
				content: attachment.content,
				contentType: attachment.type,
				encoding: 'base64',
			};
		});
	}
	// return
	return options;
}

module.exports = getSendOptions;
