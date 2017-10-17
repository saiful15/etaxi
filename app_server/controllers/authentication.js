/*
|----------------------------------------------------------------
| Requiring packages.
|----------------------------------------------------------------
*/
var 			mongoose 		=	require('mongoose'),
				validator 		=	require('validator'),
				passport 		=	require('passport'),
				passwordReset 	=	mongoose.model('password-reset'),
				users 			=	mongoose.model('users');

const Joi = require('joi');


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
			user.email = req.body.email;
			user.password = user.setPassword(req.body.password);
			user.status   =	"promo_free";
			user.account_type = "customer";
			user.statusCollection = {};
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
					var 	token	=	user.generateJwt();
					sendJsonResponse(res, 200, {
						token: token
					});
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
						error: 'Error!! while generating reset link. Contact admin',
					});
					return;
				}
				else{
					sendJsonResponse(res, 200, {
						reset: reset,
					});
				}
			})
		}
	})
}
