/*
|----------------------------------------------
| setting up admin controller 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccountant, 2017
|----------------------------------------------
*/
const Mongoose = require('mongoose');
const Joi = require('joi');
const accoutants = Mongoose.model('accountant');
const users = Mongoose.model('users');

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
| Following function will get all contacts
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.getAllContact = (req, res) => {
	users
		.find()
		.select('account_type email')
		.exec((err, contacts) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
				return;
			}
			else if (!contacts) {
				sendJsonResponse(res, 404, {
					error: `No contact has been found`,
				});
			}
			else {
				sendJsonResponse(res, 200, {
					success: true,
					contacts: contacts,
				});
			}
		})
}

module.exports.showAccountants = (req, res) => {
	accoutants
		.find()
		.exec((err, accountant) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
				return;
			}
			else {
				sendJsonResponse(res, 200, {
					accountants: accountant,
				});
			}
		})
}


module.exports.assignAccountant = (req, res) => {
	const Info = Joi.object().keys({
		userId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
		accountantId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required()
	});

	Joi.validate(req.params, Info, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			// get accountant's email address.
			accoutants
				.findById(req.params.accountantId)
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if(!accountant) {
						sendJsonResponse(res, 404, {
							error: `Error! no accountant has been found`,
						});
						return;
					}
					else {
						const accountantEmail = accountant.email;

						// now find user by given id and add this accountant to him.
						users
							.findById(req.params.userId)
							.exec((err, user) => {
								if (err) {
									sendJsonResponse(res, 404, {
										error: err,
									});
									return;
								}
								else if (!user) {
									sendJsonResponse(res, 404, {
										error: `Error! No user has been found to assign accoutant`,
									});
									return;
								}
								else {
									user.appContact.push({
										contactEmail: accountantEmail,
									});
									user.save((err) => {
										if (err) {
											sendJsonResponse(res, 404, {
												error: `Error while assigning accountant. Info: ${err}`,
											});
											return;
										}
										else {
											// now save user email into accountant's customer
											accountant.customers.push({
												customerid: user.email,
											});
											accountant.save((err) => {
												if (err) {
													sendJsonResponse(res, 404, {
														error: `Error! while saving customer information into accountant`,
													});
													return;
												}
												else {
													sendJsonResponse(res, 200, {
														success: true,
														accountant: accountant,
													});
												}
											})
										}
									})
								}
							})

					}
				})
		}
	})
}