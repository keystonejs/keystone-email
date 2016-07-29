function buildAddress (email, name) {
	if (Array.isArray(email)) {
		return email.map(function (to) { return to.name + ' <' + to.email + '>'; }).join(',');
	} else {
		return name ? name + ' <' + email + '>' : email;
	}
}

module.exports = buildAddress;
