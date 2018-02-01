/*
|----------------------------------------------
| setting up business proifle schema.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2018
|----------------------------------------------
*/

const Mongoose = require('mongoose');

const BusinessProfileSchema = Mongoose.Schema({
	 businessId: {
	 	type: String, required: true,
	 },
	 whos: {
	 	type: String, required: true,
	 },
    businessName: {
    	type: String, required: true,
    },
    businessType: {
    	type: String, required: true,
    }
});

const collectionName = 'business';

Mongoose.model('business', BusinessProfileSchema, collectionName);