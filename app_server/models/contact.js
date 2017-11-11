/*
|----------------------------------------------
| setting up contact schema
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
const mongoose = require('mongoose');

var 	businessAddressSchema 	=	new mongoose.Schema({
	house_no: {type: Number},
	street_name: {type: String},
	city: {type: String},
	county: {type: String},
	postcode: {type: String},
	created_at: {type: Date}
})

const 			contactSchema 	=	new mongoose.Schema({
	contactId: {type: String, required: true, unique: true, },
	whos: {type: String, required: true, },
	house_no: {type: Number},
	street_name: {type: String},
	city: {type: String},
	county: {type: String},
	postcode: {type: String},
	mobile: {type: String},
	landLine: {type: String},
	businessContact: {type: Boolean, default: true, },
	businessAddress: [businessAddressSchema],
	created_at: {type: Date, "default": Date.now}
});

const collectionName = 'contacts';

mongoose.model('contacts', contactSchema, collectionName);
