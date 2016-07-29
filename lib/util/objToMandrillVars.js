var _ = require('lodash');

function flattenObject (obj, delim) {
	delim = delim || '_';
	var _ret = {};

	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) continue;

		if ((typeof obj[key]) === 'object' && obj[key] !== null) {
			var _flat = flattenObject(obj[key], delim);
			for (var next in _flat) {
				if (!_flat.hasOwnProperty(next)) continue;

				_ret[key + delim + next] = _flat[next];
			}
		} else {
			_ret[key] = obj[key];
		}
	}
	return _ret;
};

function objToMandrillVars (_var) {
	var _new = [];
	if (typeof _var === 'object') {
		var _flat = flattenObject(_var, '_');
		_.forEach(_flat, function (value, key) {
			_new.push({ name: key, content: value });
		});
		return _new;
	}
	return _var;
};

module.exports = objToMandrillVars;
