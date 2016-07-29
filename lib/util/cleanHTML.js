function cleanHTML (html) {
	// ensure extended characters are replaced
	html = html.replace(/[\u007f-\uffff]/g, function (c) {
		return '&#x' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4) + ';';
	});
	return html;
}

module.exports = cleanHTML;
