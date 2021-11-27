var truthy = require('../../util/truthy');

var ADDRESS_RX = /(.*) <(.*)>/;
var EMAIL_RX = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

function processAddress (data) {
	var rtn = {
		name: '',
		address: '',
	};
	if (typeof data === 'object') {
		// support { name: { first: 'Jed', last: 'Watson' }, email: 'user@keystonejs.com' }
		if (typeof data.name === 'object') {
			rtn.firstName = data.name.first;
			rtn.lastName = data.name.last;
			data.name = [data.name.first, data.name.last].filter(truthy).join(' ');
		}

		if (data.email) {
			rtn.address = data.email;
		}

		if (data.address) {
			rtn.address = data.address;
		}

		if (data.name) {
			rtn.name = data.name;
		}
	} else if (typeof data === 'string') {
		// split email out from 'name <email>' format
		var addrParsed = ADDRESS_RX.exec(data);
		var isEmail = EMAIL_RX.test(data);
		if (addrParsed && addrParsed.length === 3) {
			rtn.name = addrParsed[1];
			rtn.address = addrParsed[2];
		} else {
			if (isEmail) {
				rtn.address = data;
			}

			rtn.name = data;
		}
	}
	return rtn;
}

module.exports = processAddress;
