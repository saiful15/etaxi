/*
|----------------------------------------------
| setting up schema model for message
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
	replyId: {type: String, min: 10, max: 10, },
	replyMessage: {type: String, },
	sender: {type: String, },
	receiver: {type: String, },
});

const messageSchema = new mongoose.Schema({
	messageId: {type: String, min: 10, max:10, required: true, },
	sender: {type: String, required: true, },
	receiver: {type: String, required: true, },
	subject: {type: String, required: true, },
	message: {type: String, required: true, },
	seenstatus: {type: Boolean, default: false },
	createdAt: {type: Date, default: Date.now },
	replyMessage: [replySchema],
});

const collectionName = 'messages';

mongoose.model('messages', messageSchema, collectionName);

