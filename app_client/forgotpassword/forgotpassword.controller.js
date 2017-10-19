/*
|----------------------------------------------
| Setting up forgotpassword controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

(function(){
	angular
		.module('etaxi')
		.controller('forgotPasswordController', forgotPasswordController);

	forgotPasswordController.$inject = ['userservice', 'account', '$routeParams'];

	function forgotPasswordController(userservice, account, $routeParams){
		const 	frp 		=	this;

		if ($routeParams.v && $routeParams.hack && $routeParams.for) {
			frp.passResetForm = true;
			frp.passResetRequest = false;
		}
		else{
			frp.passResetRequest = true;
			frp.passResetForm = false;
		}

		// user object.
		frp.user = {
			email: '',
		};
		// check user exists or not.
		frp.checkUser = function (){
			if (!frp.user.email) {
				frp.resetPassError = true;
				frp.resetPassErrorMsg = 'Please enter email address first';
				return;
			}
			else {
				frp.loading = true;
				frp.btnDisabled = true;
				userservice
				.showUser(frp.user.email)
				.then((response) => {
					if (response.data.error) {
						frp.resetPassError = true;
						if (response.data.error.isJoi === true) {
							frp.resetPassErrorMsg = response.data.error.details[0].message;
						}
						else {
							frp.resetPassErrorMsg = response.data.error;
						}
					}
					else{
						frp.resetPassError = false;
						setTimeout(()=> {
							// calling account service method.
							account
								.passwordResetLink(frp.user.email, response.data.user._id)
								.then((response) => {
									if (response.data.error) {
										frp.resetPassError = true;
										frp.resetPassErrorMsg = response.data.error;
									}
									else{
										frp.loading = false;
										frp.btnDisabled = false;
										
										frp.resetPassError = false;
										frp.resetSuccessLink = true;
										frp.resetPassSuccessMsg = 'We have sent you a password reset link. Please check your email';									
									}
								})
								.catch((err) => alert(err));

						}, 3000);
					}
				})
				.catch((err) => alert(err));
			}
		}

		/*
		|----------------------------------------------
		| Following method will validate reset key a token
		| @author: jahid haque <jahid.haque@yahoo.com>
		| @copyright: taxiaccounting, 2017
		|----------------------------------------------
		*/
		frp.validateKey = function() {
			// calling method from account service.
			account
				.validateResetKey($routeParams.v, $routeParams.hack, $routeParams.for)
				.then((response) => {
					console.log(response);
				})
				.catch((err) => alert(err));
		}
	}
})();
