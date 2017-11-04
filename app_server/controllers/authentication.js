/*
|----------------------------------------------------------------
| Requiring packages.
|----------------------------------------------------------------
*/
var 			mongoose 		=	require('mongoose'),
				validator 		=	require('validator'),
				passport 		=	require('passport'),
				passwordReset 	=	mongoose.model('password-reset'),
				users 			=	mongoose.model('users'),
				fs 				=	require('fs');
const Uid = require('uid');
const Joi = require('joi');
const Mailer = require('../config/nodemailer');


/*
|----------------------------------------------------------------
| function for returning json.
|----------------------------------------------------------------
*/
var 			sendJsonResponse	=	function(res, status, content){
	res.status(status);
	res.json(content);
}


/*
|----------------------------------------------------------------
| login controller.
|----------------------------------------------------------------
*/
module.exports.login 	=	function(req, res){
	// checking input.
	if(!req.body.email || !req.body.password)	{
		sendJsonResponse(res, 400, {
			message: "All fields required. Must not be empty"
		});
		return;
	}
	else{

		// using passport.
		passport.authenticate('local', function(err, user, info){

			if(err){
				sendJsonResponse(res, 404, err);
				return;
			}
			else{

				if(user){
					var token 	=	user.generateJwt();
					sendJsonResponse(res, 200, {
						token: token
					});
				}
				else{
					sendJsonResponse(res, 404, info);
				}
			}

		})(req, res);
	}
}

/*
|----------------------------------------------------------------
| setting up authentication controller for register
|----------------------------------------------------------------
*/
module.exports.register		=	function(req, res){
	// checking some validation.
	if(!req.body.email || !req.body.password){
		sendJsonResponse(res, 400, {
			error: "All fields required. must not be empty"
		});
	}
	else{
		// validating given input values.
		if(!validator.isEmail(req.body.email, {allow_display_name: true})){
			sendJsonResponse(res, 400, {
				error: "Invalid email address. Please enter again."
			});
			return false;
		}
		
		if(!validator.isLength(req.body.password, {min: 5, max: 12})){
			sendJsonResponse(res, 400, {
				error: "Your password should be between 5 to 12 characters"
			});
			return false;
		}
		else{
			// creating empty user and filling it with data.
			var 		user 		=	new users();
			const userId = Uid(10);
			const userDir = './users/'+userId;
			user.email = req.body.email;
			user.userId = userId;
			user.userDir = userDir;
			user.password = user.setPassword(req.body.password);
			user.status   =	"promo_free";
			user.account_type = "customer";
			// save user into the database.
			user.save(function(err){
				if(err){
					if(err.code == '11000'){
						sendJsonResponse(res, 400, {
							error: "This email address has been taken."
						});
					}
					else{
						sendJsonResponse(res, 400, {
							error: "System Error! Please contact admin"
						});	
					}
					return false;
				}
				else{
					if (!fs.mkdirSync(userDir)) {
						var 	token	=	user.generateJwt();
						sendJsonResponse(res, 200, {
							token: token
						});
					}
					else {
						sendJsonResponse(res, 400, {
							error: "System Error! while creating user directory. Please contact admin"
						});
					}
					
				}
			})
		}
	}
}

/*
|----------------------------------------------
| Following method will generate password reset
| link based on given user email
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.generateLink = (req, res) => {
	const resetInfo = Joi.object().keys({
		email: Joi.string().email().min(3).required(),
		id: Joi.string().min(24).max(24).regex(/^[a-zA-Z0-9]+/).required(),
	});

	Joi.validate(req.params, resetInfo, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else {
			// creating new password reset object.
			const resetObject = new passwordReset ();
			resetObject.who = req.params.email;
			resetObject.resetkey = resetObject.setResetKey(req.params.email);
			resetObject.hash = resetObject.generateHash(resetObject.resetKey);
			resetObject.resetLink = `forgotpassword?v=${resetObject.resetkey}&hack=${resetObject.hash}&for=${req.params.email}`;

			// now saving resetobject
			resetObject.save((err, reset) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: 'Error!! while generating reset link. Contact admin <br/>'+err,
					});
					return;
				}
				else{
					// creating message for email to send.
					const message = {
						form: process.env.mailuser,
						to: req.params.email,
						subject: `TaxiAccounting - Password Reset Link`,
						html: `<p>You have requested to reset your password, Please click following links 
						to reset your password. <br/> <a href='http://www.taxiaccounting.co.uk/${resetObject.resetLink}'
						target='_blank'>Reset Password</a></p>`,
					};
					// verifing connection.
					Mailer.verify((err, success) => {
						if (err) {
							sendJsonResponse(res, 400, {
								error: 'Error! while connecting with mail server',
							});
							return;
						}
						else {
							Mailer.sendMail(message, (err, info) => {
								if (err) {
									sendJsonResponse(res, 400, {
										error: 'Error! while sending password reset email',
									});
									return;
								}
								else{
									sendJsonResponse(res, 200, {
										reset: reset,
									});
								}
							});
						}
					});
				}
			})
		}
	})
}

module.exports.varifyKey = (req, res) => {
	const resetObject = Joi.object().keys({
		user: Joi.string().email().min(3).required(),
		key: Joi.string().min(48).min(48).regex(/^[a-zA-Z0-9]+/).required(),
		hash: Joi.string().required(),
	});

	Joi.validate(req.params, resetObject, (err, value) => {
		if (err) {
			sendJsonResponse(res, 400, {
				error: err,
			});
			return;
		}
		else{
			// checking and validating key with password reset.
			passwordReset
				.findOne({resetkey: req.params.key, who: req.params.user})
				.exec((err, reset) => {
					if (err) {
						sendJsonResponse(res, 400, {
							error: 'Error! while checking reset key. Contact admin',
						});
						return;
					}
					else {
						// validate key.
						const reset = new passwordReset();
						if (!reset.validateHash(req.params.hash, req.params.key)) {
							sendJsonResponse(res, 404, {
								error: 'Given reset key isn\'t valid',
							});
							return;
						}
						else{
							sendJsonResponse(res, 200, {
								success: true,
							});
						}
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following method will update user password
| based on given user information
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.updatePassword = (req, res) => {
	const updatePassword = Joi.object().keys({
		user: Joi.string().email().min(3).required(),		
		newpassword: Joi.string().min(6).max(18).regex(/^[a-zA-Z0-9]+/).required(),
		repeatpassword: Joi.ref('newpassword'),
	});

	Joi.validate(req.params, updatePassword, (err, value) => {
		if (err) {
			sendJsonResponse(res, 400, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			users
				.findOne({email: req.params.user})
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!user) {
						sendJsonResponse(res, 404, {
							error: `No user found with this ${req.params.user}`,
						});
						return;
					}
					else{
						user.password = user.setPassword(req.params.repeatpassword);
						// now save this change.
						user.save((err, user) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: `Error! while saving changes. Contact admin`,
								});
								return;
							}
							else{
								sendJsonResponse(res, 200, {
									success: true,
								});
							}
						})
					}
				})
		}
	});
}
