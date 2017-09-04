/*
|----------------------------------------------------------------
| Requiring packages.
|----------------------------------------------------------------
*/
var 			mongoose 		=	require('mongoose'),
				validator 		=	require('validator'),
				passport 		=	require('passport'),
				users 			=	mongoose.model('users');


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
