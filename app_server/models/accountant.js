/*
|----------------------------------------------
| setting up accountant collection schema
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccountant, 2017
|----------------------------------------------
*/
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
	name: {type: String, min: 5, required: true, },
	address: {type: String, min: 5, required: true, },
	email: {type: String, },
	tel: {type: String, min: 11, max: 11, },
	website: {type: String, },
});

const customerSchema = new mongoose.Schema({
	customerid: {type: String, },
});

const accountantSchema = new mongoose.Schema({
	name: {type: String, min: 3, required: true, },
	email: {type: String, required: true, },
	mobile: {type: String, min: 11, max: 11, required: true, },
	accountCreated: {type: Boolean, default: false, },
	company: [companySchema],
	customers: [customerSchema],
});

const collectionName = 'accountant';

mongoose.model('accountant', accountantSchema, collectionName);
