/*
|----------------------------------------------
| setting up mongoose model for expenses
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
	expenseId: {type: String, required: true, unique: true },
	whos: {type: String, required: true, },
	startDate: { type: String, default: Date.now},
	expense_sector: {type: String, required: true },
	amount: {type: Number, required: true, min: 0 },
	createdAt: { type: Date, default: Date.now }
});

const collectionName = 'expenses';

mongoose.model('expenses', expenseSchema, collectionName);
