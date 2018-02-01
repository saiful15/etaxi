/*
|----------------------------------------------
| setting up insurance schema.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2018
|----------------------------------------------
*/

const Mongoose = require('mongoose');


const insuranceSchema = Mongoose.Schema({
	 insuranceId: {
	 	type: String, required: true,
	 },
	 whos: {
	 	type: String, required: true,
	 },
    provider_name: {
    	type: String, required: true,
    },
    valid_till: {
    	type: String, required: true,
    },
    insurance_number: {
    	type: String, required: true,
    },
    created_at: {
    	type: Date, default: Date.now,
    },
});

const collectionName = 'insurance';

Mongoose.model('insurance', insuranceSchema, collectionName);