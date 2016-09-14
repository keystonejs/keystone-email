/*
Rename to test.config.js and configure your nodemailer transport and auth here.
Example SMTP config:
*/

var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: 'user@gmail.com',
		pass: 'pass',
	},
};

module.exports = smtpConfig;
