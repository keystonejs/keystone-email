var debug = require('debug')('keystone:email');
var htmlToText = require('html-to-text');
var path = require('path');

var cleanHTML = require('./util/cleanHTML');
var getEngine = require('./util/getEngine');
var getTransport = require('./util/getTransport');
var isFile = require('./util/isFile');

function Email (template, options) {
	debug('email %s', template);

	options = options || {};

	if (!template) {
		throw new Error('You must provide an email template');
	}

	// init extension and engine
	this.ext = path.extname(template);
	var engine = options.engine;
	if (!engine && !this.ext) {
		throw new Error('You must provide an engine or include the extension in your template');
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
	if (!this.template) {
		throw new Error('Invalid template (' + template + ')');
	}

	// init transport
	if (options.transport) {
		this.transport = getTransport(options.transport);
	}
}

Email.prototype.render = function (options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = (typeof options === 'object') ? options : {};
	callback = (typeof callback === 'function') ? callback : function () {};

	this.engine(this.path, options, function (err, html) {
		if (err) return callback(err);
		callback({
			text: htmlToText.fromString(html),
			html: cleanHTML(html),
		});
	});
};

Email.prototype.resolve = function (name) {
	var loc = path.resolve(this.root, name);
	var dir = path.dirname(loc);
	var file = path.basename(loc, this.ext);
	var filepath = path.join(dir, file);
	return isFile(filepath) ? filepath : undefined;
};

Email.prototype.send = function (options, callback) {
	if (!this.transport) {
		
	}
	// TODO: Process options
	this.render(function (err, email) {
		if (err) return callback(err);
		this.transport(email, options, callback);
	});
};

Email.send = function (emailOptions, sendOptions, callback) {
	return new Email(emailOptions).send(sendOptions, callback);
};
