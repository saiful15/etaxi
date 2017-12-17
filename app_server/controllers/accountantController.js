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
};


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
};

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
};

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
};

/*
|----------------------------------------------
| Following function will save edited details 
| for accountant's company
|----------------------------------------------
*/
module.exports.editAccountantCompanyInfo = (req, res) => {
	const BasicInfo = Joi.object().keys({
		name: Joi.string().min(3).max(16).regex(/^[a-zA-Z ]{3,16}$/).required(),
		address: Joi.string().min(5).max(25).regex(/^[a-zA-Z 0-9]{5,25}$/).required(),
		email: Joi.string().email().allow('', null),
		useremail: Joi.string().email(),
		website: Joi.string().uri().allow('', null),
		Tel: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/).allow('', null),
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
				.findOne({ email: req.body.useremail })
				.select('company')
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!accountant) {
						sendJsonResponse(res, 404, {
							error: `No Accountant found with ${req.body.useremail}`,
						});
					}
					else {
						accountant.company[0].name = req.body.name;
						accountant.company[0].address = req.body.address;
						accountant.company[0].email = req.body.email;
						accountant.company[0].website = req.body.website;
						accountant.company[0].Tel = req.body.Tel;

						accountant.save((err) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: `Error! while saving accountant's company info`,
								});
								return;
							}
							else {
								sendJsonResponse(res, 202, {
									success: true,
								});
							}
						});
					}	
				});
		}
	});
};

/*
|----------------------------------------------
| Following function will get all customer data.
|----------------------------------------------
*/
module.exports.getCustomerInfo = (req, res) => {
	const userId = Joi.object().keys({
		userId: Joi.string().max(10).required(),
	});

	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Users
				.findOne({ userId: req.params.userId })
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!user) {
						sendJsonResponse(res, 404, {
							error: `No user found with ${req.params.userId} id`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							userInfo: user,
						});
					}
				})
		}
	})
}