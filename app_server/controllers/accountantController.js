/*
|----------------------------------------------
| setting up accountant controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
const Mongoose = require('mongoose');
const Joi = require('joi');
const Users = Mongoose.model('users');
const Accountants = Mongoose.model('accountant');


/*
|----------------------------------------------------------------
| function for returning json.
|----------------------------------------------------------------
*/
const sendJsonResponse	=	function(res, status, content){
	res.status(status);
	res.json(content);
}


/*
|----------------------------------------------
| Following function will get all customer 
| assigned to given user email
|----------------------------------------------
*/
module.exports.getCustomers = (req, res) => {
	const AccountantIdentity = Joi.object().keys({
		email: Joi.string().email().required(),
	});

	Joi.validate(req.params, AccountantIdentity, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Users
				.find({ appContact: {$elemMatch: { contactEmail: req.params.email } } })
				.select('name userId')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!user) {
						sendJsonResponse(res, 404, {
							error: `No assigned customer found`,
						});
					}
					else {
						sendJsonResponse(res, 200, {
							customers: user,
						});
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following function will show accountant profile
|----------------------------------------------
*/
module.exports.getProfile = (req, res) => {
	const AccountantIdentity = Joi.object().keys({
		email: Joi.string().email().required(),
	});

	Joi.validate(req.params, AccountantIdentity, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
		}
		else {
			Accountants
				.findOne({ email: req.params.email })
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							accountant: accountant,
						});
					}

				})
		}
	})
}