var truthy = require('./truthy');

var ADDRESS_RX = /(.*)? <(.*)>/;

function processAddress (data) {
	var rtn = {
		address: '',
	};
	if (typeof data === 'object') {
		// support { name: { first: 'Jed', last: 'Watson' }, email: 'user@keystonejs.com' }
		if (typeof data.name === 'object') {
			rtn.firstName = data.name.first;
			rtn.lastName = data.name.last;
			data.name = [data.name.first, data.name.last].filter(truthy).join(' ');
		}
		// process { name: 'Jed Watson', email: 'user@keystonejs.com' } into 'name <email>' format
		if (data.address) {
			rtn.address = data.address;
		} else if (data.name && data.email) {
			rtn.address = data.name + ' <' + data.email + '>';
		}

		rtn.name = data.name ? data.name : '';
		rtn.email = data.email ? data.email : '';
	} else if (typeof data === 'string') {
		rtn.address = data;
		// split email out from 'name <email>' format, and add name
		var parsed = ADDRESS_RX.exec(data);
		if (parsed && parsed.length === 3) {
			rtn.name = parsed[1] ? parsed[1] : parsed[2];
			rtn.email = parsed[2];
		} else {
			rtn.email = data;
			rtn.name = data;
		}
	}
	return rtn;
}

module.exports = processAddress;
