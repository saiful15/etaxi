/*
|----------------------------------------------
| setting up setting page schema for customers
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

const mongoose = require('mongoose');


var 		addressSchema 		=	new mongoose.Schema({
	county: {type: String},
	city_name: {type: String},
	postcode: {type: String},
	street_name: {type: String},
	house_number: {type: Number},
});

var 	businessSchema 			=	new mongoose.Schema({
	name: {type: String},
	type: {type: String},
	created_at: {type: Date, default: Date.now}
});

var 			lisenceSchema 	=	new mongoose.Schema({
	dvla: {type: Number},
	taxi: {type: Array},
	valid_till: {type: Date},
	created_at: {type: Date, default: Date.now}
});

var 			vehicleSchema 	=	new mongoose.Schema({
	settingId: {type: String, required: true, },
	whos: {type: String, required: true, },
	car_type: {type: String},
	brand: {type: String},
	rg_number: {type: String},
	car_value: {type: Number},
	mot: {type: String, },
	road_tax: {type: String, },
	car_status: {type: String},
	created_at: {type: Date, default: Date.now}
});


const collectionName = 'vehicles';

mongoose.model('vehicles', vehicleSchema, collectionName);

