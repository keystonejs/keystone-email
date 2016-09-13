var assign = require('object-assign');

var processAddress = require('../../util/processAddress');

function getRecipientsAndVars (to, vars) {
	if (!vars) vars = {};
	var recipients = [];
	(Array.isArray(to) ? to : [to]).forEach(function (i) {
		var rcpt = processAddress(i);
		if (!rcpt.address) return;
		recipients.push(rcpt.address);
		if (!vars[rcpt.email]) {
			vars[rcpt.email] = {};
		}
		if (typeof i === 'object' && i.vars) {
			assign(vars[rcpt.email], i.vars);
		}
		if (!vars[rcpt.email].name) vars[rcpt.email].name = rcpt.name;
		if (!vars[rcpt.email].email) vars[rcpt.email].email = rcpt.email;
		if (!vars[rcpt.email].firstName) vars[rcpt.email].firstName = rcpt.firstName;
		if (!vars[rcpt.email].lastName) vars[rcpt.email].lastName = rcpt.lastName;
	});
	return {
		recipients: recipients,
		vars: vars,
	};
};

module.exports = getRecipientsAndVars;
