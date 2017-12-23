/*
|----------------------------------------------
| setting up docs model for the collection
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

const mongoose = require('mongoose');


const docSchema = new mongoose.Schema({
	docId: {type: String, min: 24, max:24, required: true, },
	uploader: {type: String, required: true, },
	name: {type: String, required: true, },
	whatFor: {type: String, required: true, },
	docLocation: {type: String, required: true, },
	createdAt: {type: Date, default: Date.now },
});

const collectionName = 'documents';

mongoose.model('docs', docSchema, collectionName);
