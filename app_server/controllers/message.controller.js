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
const Users = Mongoose.model('users');
const Uid = require('uid');

const sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
}

module.exports.loadContacts = (req, res) => {
	const userIdentity = Joi.object().keys({
		email: Joi.string().email().min(3).required(),
	});

	Joi.validate(req.params, userIdentity, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Users
				.find({ email: req.params.email })
				.select('appContact')
				.exec((err, contacts) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!contacts) {
						sendJsonResponse(res, 404, {
							error: `No contact found`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true, 
							contacts: contacts,
						});
					}
				})
		}
	})
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

module.exports.viewMessage = (req, res) => {
	const messageid = Joi.object().keys({
		messageId : Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
	});

	Joi.validate(req.params, messageid, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Message
				.findOne({_id: req.params.messageId})
				.exec((err, message) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!message) {
						sendJsonResponse(res, 404, {
							error: `Error! while loding message`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							message: message,
						});
					}
				})
		}
	})
}

module.exports.viewSent = (req, res) => {
	const userId = Joi.object().keys({
		userId: Joi.string().email().min(3).required(),
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
				.find({sender: req.params.userId})
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
	});
}

module.exports.replyMessage = (req, res) => {
	const MessageId = Joi.object().keys({
		messageId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
	});

	Joi.validate(req.params, MessageId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			const replyMessage = Joi.object().keys({
				reply: Joi.string().max(255).required(),
				sender: Joi.string().email().required(),
				receiver: Joi.string().email().required(),
			});

			Joi.validate(req.body, replyMessage, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err.details[0].message,
					});
					return;
				}
				else {
					Message
						.findById(req.params.messageId)
						.select('replyMessage')
						.exec((err, reply) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							else if (!reply) {
								sendJsonResponse(res, 404, {
									error: `No message found to reply`,
								});
								return;
							}
							else {

								reply.replyMessage.push({
									replyId : Uid(10),
									replyMessage : req.body.reply,
									sender : req.body.sender,
									receiver : req.body.receiver,
								});

								reply.save((err) => {
									if (err) {
										sendJsonResponse(res, 404, {
											error: err,
										});
										return;
									}
									else {
										sendJsonResponse(res, 200, {
											success: true,
										});
									}
								})
							}
						})
				}
			})
		}
	})
}