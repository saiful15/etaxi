/*
|----------------------------------------------
| Following controller is for message only
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
const Joi = require('joi');
const Mongoose = require('mongoose');
const Message = Mongoose.model('messages');
const Uid = require('uid');

const sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
}

module.exports.sendMessage = (req, res) => {
	const messageObject = Joi.object().keys({
		sender: Joi.string().email().min(3).required(),
		receiver: Joi.string().required(),
		subject: Joi.string().required(),
		message: Joi.string().required(),
	});

	Joi.validate(req.body, messageObject, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			const message = new Message();

			message.messageId = Uid(10);
			message.sender = req.body.sender;
			message.receiver = req.body.receiver;
			message.subject = req.body.subject;
			message.message = req.body.message;

			message.save((err) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else {
					sendJsonResponse(res, 200, {
						success: true,
						message: message,
					});
					return;
				}
			})
		}
	})
}

module.exports.viewMessages = (req, res) => {
	const userId = Joi.object().keys({
		userid: Joi.string().email().min(3).required(),
	});

	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Message
				.find({receiver: req.params.userid})
				.exec((err, messages) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!messages) {
						sendJsonResponse(res, 404, {
							error: `Error! while loading message inbox`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							message: messages,
						});
					}
				})
		}
	})
}
