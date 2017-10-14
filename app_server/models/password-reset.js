/*
|----------------------------------------------
| setting up schema model for password reset.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/

'use strict';

const mongoose = require('mongoose');

const crypto = require('crypto');

const passwordResetSchema = new mongoose.Schema({
				who: {type: String, required: true },
				resetkey: {type: String, required: true, },
				resetLink: {type: String, required: true, },
				hash: {type: String, required: true },
				createdAt: {type: Date, default: Date.now },
});

const collectoinName = 'password-reset';

// register model with mongoose. 
mongoose.model('password-reset', passwordResetSchema, collectoinName);


