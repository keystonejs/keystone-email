var processAddress = require('../../util/processAddress');

function getRecipients (to) {
	var recipients = [];
	(Array.isArray(to) ? to : [to]).forEach(function (i) {
		var rcpt = processAddress(i);
		if (!rcpt.address) return;
		recipients.push(rcpt.address);
	});
	return recipients;
};

module.exports = getRecipients;
