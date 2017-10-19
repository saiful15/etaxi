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

const jwt = require('jsonwebtoken');

let valid = false;

const passwordResetSchema = new mongoose.Schema({
	who: {type: String, required: true },
	resetkey: {type: String, required: true, },
	hash: {type: String, required: true },
	resetLink: {type: String, required: true, },
	activeState: {type: Boolean, default: false },
	createdAt: {type: Date, default: Date.now },
});

// generate resetkey
passwordResetSchema.methods.setResetKey = (email) => {
	const salt = crypto.randomBytes(16).toString('hex');
	return this.resetkey = crypto.pbkdf2Sync(email, salt, 1000, 24, 'sha512').toString('hex');
}


// generate hash
passwordResetSchema.methods.generateHash = () => {
	var 	expiry 	=	new Date();
	expiry.setDate(expiry.getDate() + 1);
	return jwt.sign({
		_id: this._id,
		email: this.who,
		exp: parseInt(expiry.getTime() / 1000 ),
	}, this.resetkey);
}

/*
|----------------------------------------------------------------
| Setting up method to validate hash.
|----------------------------------------------------------------
*/
passwordResetSchema.methods.validateHash 	= function(hash, key){
	try{
		return jwt.verify(hash, key);
	}
	catch(err){
		return false;
	}
}

const collectoinName = 'password-reset';

// register model with mongoose. 
mongoose.model('password-reset', passwordResetSchema, collectoinName);


