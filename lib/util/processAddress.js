var truthy = require('./truthy');

var ADDRESS_RX = /.*<(.*)>/;

function processAddress (data) {
	var rtn = {
		email: '',
		address: '',
	};
	if (typeof data === 'object') {
		// support { name: { first: 'Jed', last: 'Watson' }, email: 'user@keystonejs.com' }
		if (typeof data.name === 'object') {
			rtn.firstName = data.name.first;
			rtn.lastName = data.name.last;
			rtn.name = [data.name.first, data.name.last].filter(truthy).join(' ');
		} else if (data.name) {
			rtn.name = data.name;
		}
		// process { name: 'Jed Watson', email: 'user@keystonejs.com' } into 'name <email>' format
		if (data.name && data.email) {
			rtn.address = rtn.name + ' <' + data.email + '>';
		}
		rtn.email = data.email;
	} else if (typeof data === 'string') {
		rtn.address = data;
		// split email out from 'name <email>' format
		var parsed = ADDRESS_RX.exec(data);
		if (parsed && parsed.length === 2) {
			rtn.email = parsed[1];
		} else {
			rtn.email = data;
		}
	}
	return rtn;
}

module.exports = processAddress;
