var objToMandrillVars = require('./objToMandrillVars');
var truthy = require('../../util/truthy');

function getRecipientsAndMergeVars (to) {
	var mergeVars = [];
	var recipients = [];
	(Array.isArray(to) ? to : [to]).forEach(function (i) {
		var vars = [];
		// email
		if (typeof i === 'string') {
			i = { email: i };
		}
		// skip empty entries
		if (typeof i !== 'object' || !i.email) return;
		vars.push({ name: 'email', content: i.email });
		// name
		if (typeof i.name === 'string') {
			vars.push({ name: 'name', content: i.name });
		} else if (typeof i.name === 'object') {
			var fullName = [i.name.first, i.name.last].filter(truthy).join(' ');
			vars.push({ name: 'name', content: fullName || '' });
			vars.push({ name: 'first_name', content: i.name.first || '' });
			vars.push({ name: 'last_name', content: i.name.last || '' });
			i.name = fullName;
		}
		// merge vars
		if (i.vars) {
			vars.concat(objToMandrillVars(i.vars));
		}
		// push
		recipients.push(i);
		mergeVars.push({
			rcpt: i.email,
			vars: vars,
		});
	});
	return {
		recipients: recipients,
		mergeVars: mergeVars,
	};
};

module.exports = getRecipientsAndMergeVars;
