var assign = require('object-assign');
var debug = require('debug')('keystone:email');
var htmlToText = require('html-to-text');
var path = require('path');

var cleanHTML = require('./util/cleanHTML');
var getEngine = require('./util/getEngine');
var getTransport = require('./util/getTransport');
var isFile = require('./util/isFile');

/*
Email constructor. Requires a template path to be provided, and a valid engine
must be specified in the options. See Readme.md for explanation
*/
function Email (template, options) {
	debug('email %s', template);

	options = options || {};

	if (!template) {
		throw new Error('You must provide an email template');
	}

	// init extension and engine
	// options.ext is supported for backwards compatibility with keystone.Email
	this.ext = path.extname(template) || options.ext;
	var engine = options.engine;
	if (!this.ext && !engine) {
		throw new Error('You must provide options.engine or include the extension in your template path');
	} else if (!this.ext && typeof engine === 'function') {
		throw new Error('You must include the extension in your template path when options.engine is a function');
	} else if (!this.ext) {
		this.ext = '.' + engine;
	} else if (!engine) {
		engine = this.ext.substr(1);
	}
	this.engine = getEngine(engine);
	if (typeof this.engine !== 'function') {
		throw new Error('Invalid engine (' + engine + ')');
	}

	// init template
	this.root = options.root || process.cwd();
	this.template = this.resolve(template);
	if (!isFile(this.template)) {
		throw new Error('Invalid template (' + template + '), could not find file "' + this.template + '"');
	}

	// init transport
	if (options.transport) {
		this.transport = getTransport(options.transport);
	}

	// stash options without consumed properties, this.send() uses it as defaults
	this.options = assign({}, options);
	delete this.options.engine;
	delete this.options.ext;
	delete this.options.root;
	delete this.options.transport;
}

/*
Renders the template without sending an email. Options are passed to the
template as local variables.
*/
Email.prototype.render = function (options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = (typeof options === 'object') ? options : {};
	callback = (typeof callback === 'function') ? callback : function () {};

	this.engine(this.template, options, function (err, html) {
		if (err) return callback(err);
		callback(null, {
			text: htmlToText.fromString(html),
			html: cleanHTML(html),
		});
	});
};

/*
Resolves the path for a template, and ensures it points to a file
*/
Email.prototype.resolve = function (name) {
	// resolve the name with the root option
	var loc = path.resolve(this.root, name);
	// pull the directory part out of the resolved path
	var dir = path.dirname(loc);
	// put the filename part out of the resolved path, without the extension
	// since the extension may or may not be provided in name, we explicitly
	// put it back in the next step
	var file = path.basename(loc, this.ext);
	// join the directory, filename and extension to get the full path
	var filepath = path.join(dir, file + this.ext);
	// if the file exists, return the resolved path, otherwise undefined
	return filepath;
};

/*
Sends the email. Will render the template first

Takes renderOptions (i.e. local variables for the template) and sendOptions
(passed to the transport) - see Readme.md for explanation
*/
Email.prototype.send = function (renderOptions, sendOptions, callback) {
	sendOptions = assign({}, this.options, sendOptions);
	if (!callback) {
		if (typeof sendOptions === 'function') {
			throw new Error('[Email.send] Please pass renderOptions, sendOptions and a callback. See the documentation for more information!');
		} else {
			throw new Error('[Email.send] Please provide a callback as the last argument!');
		}
	}
	if (!this.transport) {
		return callback(new Error('Transport must be set to use Email.send()'));
	}
	this.render(renderOptions, function (err, email) {
		if (err) return callback(err);
		this.transport(email, sendOptions, callback);
	});
};

/*
Shorthand method to create and send an email in a single call without
creating a new Email() instance. Requires all options objects to be provided
*/
Email.send = function (template, emailOptions, renderOptions, sendOptions, callback) {
	return new Email(template, emailOptions).send(renderOptions, sendOptions, callback);
};

module.exports = Email;
