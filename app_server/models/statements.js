/*
|----------------------------------------------
| settingup statement schema for member
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2018
|----------------------------------------------
*/

const Mongoose = require('mongoose');

const statementSchema = Mongoose.Schema({
	statementId: {
		type: String, min: 10, max: 10, required: true,
	},
	whos: {
		type: String, required: true,
	},
	documentDir: {
		type: String, required: true,
	},
	documentName: {
		type: String, required: true,
	},
	createdAt: {
		type: String, default: Date.now,
	},
});

const collectionName = 'statement';

Mongoose.model('statement', statementSchema, collectionName);