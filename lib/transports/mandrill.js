var mandrill = require('mandrill-api/mandrill');

function send (email, options, callback) {
	var client = new mandrill.Mandrill(options.apiKey || process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
	delete options.apiKey;
	client.messages.send(
		{ message: options },
		function (res) { callback(null, res); }, // onSuccess
		function (res) { callback(res); } // onError
	);
}

module.exports = send;
