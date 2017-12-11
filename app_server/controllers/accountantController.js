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

/*
|----------------------------------------------
| Following function will save edited details
| for accountant.
|----------------------------------------------
*/
module.exports.editAccountantBasicContact = (req, res) => {
	const BasicInfo = Joi.object().keys({
		name: Joi.string().min(3).max(16).regex(/^[a-zA-Z ]{3,16}$/).allow('', null),
		mobile: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/),
		email: Joi.string().email(),
	});

	Joi.validate(req.body, BasicInfo, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Accountants
				.findOne({ email: req.body.email })
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else {
						accountant.name = req.body.name;
						accountant.mobile = req.body.mobile;

						// now save the accountant with latest values.
						accountant.save((err) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: `Error! while saving accountant's basic contact`,
								});
								return;
							}
							else {
								sendJsonResponse(res, 202, {
									success: true,
								});
							}
						})
					}
				})
		}
	})
}