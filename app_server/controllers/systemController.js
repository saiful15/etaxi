/*
|----------------------------------------------
| setting up controller for system
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

const Joi = require('joi');
const NodeMailer = require('nodemailer');
/*
|----------------------------------------------------------------
| function for returning json.
|----------------------------------------------------------------
*/
const 			sendJsonResponse	=	(res, status, content) => {
	res.status(status);
	res.json(content);
};

// defining Joi object for message.
const message = Joi.object().keys({
	name: Joi.string().min(2).max(24).regex(/^[a-zA-Z ]{3,24}$/).required(),
	email: Joi.string().email().required(),
	body: Joi.string().min(2).max(250).required(),
});

module.exports.sendMessage = (req, res) => {
	Joi.validate(req.body, message, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			
			// setting up nodemail trans
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

			const transporter = NodeMailer.createTransport(smtpPool);

			transporter.verify((err, success) => {
				if (err) {
					sendJsonResponse(res, 400, {
						error: 'Error! while connecting with mail server. Contact admin',
					});
					return;
				}
				else{
					const message = {
						form: process.env.mailuser,
						to: process.env.mailuser,
						subject: `Customer enquery - ${req.body.name}`,
						html: `<p>${req.body.body} <br/> Best regards, <br/><br/> ${req.body.name} <br/> ${req.body.email}</p>`,
					};
					// send mail
					transporter.sendMail(message , (err, info) => {
						if (err) {
							sendJsonResponse(res, 400, {
								error: 'Error! while sending email. Contact admin',
							});
							return;
						}
						else{
							return sendJsonResponse(res, 200, {
								success: true,
							});
						}
					})
				}
			})
		}
	})
}
