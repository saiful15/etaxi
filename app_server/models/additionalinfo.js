/*
|----------------------------------------------
| setting up additional info schema for app
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2018
|----------------------------------------------
*/

const Mongoose = require('mongoose');

const additionalInfoSchema = Mongoose.Schema({
	infoId: {
		type: String, min: 10, max: 10, required: true, unique: true,
	},
	whos: {
		type: String, required: true,
	},
	ni_number: {
		type: String, required: true,
	},
	uti_number: {
		type: String, required: true,
	},
	createdAt: {
		type: Date, default: Date.now,
	},
});

const collectionName = 'additionalinfo';

Mongoose.model('additionalinfo', additionalInfoSchema, collectionName);