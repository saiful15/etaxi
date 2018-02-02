/*
|----------------------------------------------
| setting up lisence schema for application
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2018
|----------------------------------------------
*/

const Mongoose = require('mongoose');

const lisenceSchema = Mongoose.Schema({
	lisenceId : {
		type: String, min: 10, max: 10, required: true, unique: true,
	},
	whos: {
		type: String, required: true,
	},
	dvla: {
		type: String, required: true,
	},
	taxi_type: {
		type: String, required: true,
	},
	valid_till: {
		type: String, required: true,
	},
	createdAt: {
		type: Date, default: Date.now,
	},
});

const collectionName = 'lisence';

Mongoose.model('lisence', lisenceSchema, collectionName);