var assign = require('object-assign');

var processAddress = require('../../util/processAddress');
var getRecipients = require('./getRecipients');

var smtpConfig = {
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: true, // use SSL
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
};

var defaultOptions = {
	inlineCSS: true,
	nodemailerConfig: smtpConfig,
};

function getSendOptions (options) {
	// default options
	options = assign({}, defaultOptions, options);
	// process from name and email
	options.from = processAddress(options.from);
	// process recipients
	options.to = getRecipients(options.to);
	// process attachments
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
