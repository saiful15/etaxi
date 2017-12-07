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
			Accountants
				.findOne({ email: req.params.email})
				.select('customers')
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true, 
							customers: accountant,
						});
					}
				})
		}
	})
}