# keystone-email

Email helper for KeystoneJS and Node.js Applications. Makes it easy to send dynamic emails from templates, to one or multiple recipients.

Features include:

* Express-like template system (including support for any express-compatible template engine)
* Support for different email sending services (Mandrill and Mailgun are available now, more may be added)
* Understands Keystone User models, making it easy to send emails to the results of a query
* Automatically transforms user variables into the correct format for each email service, for mail-merge style variable use
* CSS Stylesheets are automatically inlined for robust email client compatibility
* Text copy is automatically extracted from HTML content

### Background

We're moving the built-in email functionality out of KeystoneJS core (`keystone.Email`) into its own package, so that it's not bundled by default and can be updated independently.

If you're interested in helping out, please open an issue!

## Usage

Create a new Email instance with a template and options:

```
var Email = require('keystone-email')
new Email(template, emailOptions)
```

HTML from your template will automatically be converted to text using the [html-to-text](https://www.npmjs.com/package/html-to-text) package.

CSS will be automatically inline with [Juice](https://www.npmjs.com/package/juice) or natively by Mandrill if you are using that service.

#### Options

- `engine` (optional, String or Function) the template engine you are using. Defaults to the extension in the template argument.
- `transport` (String) the email service you wish to use. Supported options are `mailgun` and `mandrill`. Required for the `send()` method to work, but not for `render()`
- `root` (optional, String) the root path to look in when resolving template paths. Defaults to the current working directory.

#### Engines

Strings are treated as package names, and loaded with `require()`.

Functions are the template engine itself.

If you don't want to parse your template, set your engine to `"html"`.

### Sending Email

Once you have created an Email instance, use the send method to send it:

```js
new Email('template.pug', { transport: 'mailgun' }).send(locals, options, (err) => { /* sent */ })
```

#### Arguments

- `locals` (Object) local variables / options for the template engine
- `options` (Object) options for the transport, extends options set in the `mailgun` or `mandrill` options passed to the Email constructor
- `callback` (Function) called when the email has been sent, passed an error if one occurred

### Rendering Email

You can also render the contents of an email without sending it, useful for providing a "view email in your browser" feature or previewing email templates during development.

```js
new Email('template.pug').render(locals, (err, { html, text }) => { /* rendered */ })
```

- `locals` (Object) local variables / options for the template engine
- `callback` (Function) called when the email has been sent, passed an error if one occurred

## Usage with Mailgun

The following `send()` options are applicable when using `mailgun` as the transport:

- `apiKey` (required, String) Your API Key, defaults to `process.env.MAILGUN_API_KEY`
- `domain` (required, String) Your sending domain, defaults to `process.env.MAILGUN_DOMAIN`
- `from` (String or Object) The name and email to send from (see below)
- `inlineCSS` (Boolean) inline CSS classes in your template, defaults to `true`
- `to` (String, Object or Array) The recipient(s) of the email (see below)
- `o:tracking` (Boolean) track open and click statistics for the email, defaults to `true`
- `recipient-variables` (Object) Mailgun merge variables in Object format (keyed by email address)

See [mailgun-js](https://www.npmjs.com/package/mailgun-js) and [the Mailgun API Docs](https://documentation.mailgun.com/api-sending.html#sending) for the full set of supported options.

## Usage with Mandrill

The following `send()` options are applicable when using `mandrill` as the transport:

- `apiKey` (required, String) Your API Key, defaults to `process.env.MANDRILL_API_KEY`
- `async` (Boolean) send the email asynchronously, defaults to `true`
- `from` (String or Object) The name and email to send from (see below)
- `globalMergeVars` (Object) Mandrill global merge vars in Object format (keys can be nested), will be flattened into the array format Mandrill expects
- `inline_css` (Boolean) inline CSS classes in your template, defaults to `true`
- `preserve_recipients` (Boolean) put all recipients in the `to` field, defaults to `false`
- `to` (String, Object or Array) The recipient(s) of the email (see below)
- `track_clicks` (Boolean) track click statistics for the email, defaults to `true`
- `track_opens` (Boolean) track open statistics for the email, defaults to `true`

See [the Mandrill API Docs](https://mandrillapp.com/api/docs/messages.nodejs.html#method-send) for the full set of supported options.

## From option

The `from` option can be a String (email address), or Object containing `name` and `email`. In the object form, `name` can also be an object containing `first` and `last` (which will be concatenated with a space). This simplifies usage with `User` models in KeystoneJS. For example:

```js
{ from: 'user@keystonejs.com' }
{ from: { email: 'user@keystonejs.com', name: 'Jed Watson' }
{ from: { email: 'user@keystonejs.com', name: { first: 'Jed', last: 'Watson' } }
```

## To option

The `to` option can be a single recipient or an Array of recipients. Each recipient is represented by a String (email address) or Object containing `name`, `email` and optional `vars`. As with `from`, name can be an object with `first` and `last` properties.

For Mandrill, `merge_vars` are built for each recipient, including `email`, `name`, `first_name` and `last_name`, as well as any properties in the `vars` object for each recipient. Nested objects are supported and are automatically flattened into the array format Mandrill expects.

For Mailgun, `recipient-variables` are built for each recipient, including `email`, `name`, `first_name` and `last_name`, as well as any properties in the `vars` object for each recipient. Existing `recipient-variables` are left intact.

Full example of specifying recipients in various formats:

```js
// single recipient
{ to: 'user@keystonejs.com' }
{ to: { email: 'user@keystonejs.com', name: 'Jed Watson' } }
{ to: {
	email: 'user@keystonejs.com',
	name: { first: 'Jed', last: 'Watson' },
	vars: { role: 'Developer' }
} }
// multiple recipients
{ to: [
	{ email: 'user@keystonejs.com', name: 'Jed Watson', vars: { home: 'Sydney' } }
	{ email: 'user@keystonejs.com', name: 'Max Stoiber', vars: { home: 'Vienna' } }
] }
```

## Breaking changes from `keystone.Email`

### Template helpers

The built-in template helpers have been removed. If you used these are are interested in helping create their replacement, let us know.

### Default locals

Default locals have been removed. If you need them, please pass them explicitly. They were:

```
pretty: true,
_: require('lodash'),
moment: require('moment'),
utils: require('keystone-utils),
subject: '(no subject)',
theme: {}
```

### Mandrill template support

Mandrill template support has been dropped. If you are going to use this, you're not using most of the functionality of this package anyway, and we suggest you simply use Mandrill's API directly.

### Automatic tagging

Keystone would previously automatically tag emails with the sent date and template name. That's pretty opinionated and of questionable usefulness, if you still want this behaviour it's easy to add tags yourself in the `send()` options.

### Path changes

You could previously use a directory as the template name, and Keystone.Email would look for an `email.{ext}` file (where ext is your template language's default extension). This is no longer supported, please provide the full path to your email template.

### To, From and Contents validation

Keystone would previous return errors if the subject, contents, recipient(s) or the sender address were invalid. This is no longer handled by the library, please make sure you validate these options before sending the emails. If the transport validates these options, errors will be passed directly to the callback.

## License

MIT Licensed. Copyright (c) 2016 Jed Watson.

Portions of this library are based on Express, see https://github.com/expressjs/express for copyright.
