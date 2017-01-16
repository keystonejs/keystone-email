var truthy = require('../../util/truthy');

var ADDRESS_RX = /(.*)<(.*)>/;

function processAddress(data) {
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
        rtn.name = data.name;
    } else if (typeof data === 'string') {
        rtn.address = data;
        // split email out from 'name <email>' format
        var parsed = ADDRESS_RX.exec(data);
        if (parsed && parsed.length === 3) {
            rtn.email = parsed[1];
            rtn.address = parsed[2];
        } else {
            rtn.address = data;
        }
    }
    return rtn;
}

module.exports = processAddress;
