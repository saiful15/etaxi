/*
|----------------------------------------------
| setting up nodemail for application
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

const NodeMailer = require('nodemailer');

// create nodemailer smtp pool
const smtpPool = {
	service: 'gmail',
	port: 25,
	secure: false,
	auth: {
		user: process.env.mailuser,
		pass: process.env.mailpass,
	},
	tls: {
		rejectUnauthorized: false,
	}
};

// creating nodemailer transport
const transporter = NodeMailer.createTransport(smtpPool);

module.exports = transporter;
