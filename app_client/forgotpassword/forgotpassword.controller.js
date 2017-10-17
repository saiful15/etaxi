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

		// checking route has any query parameters.
		if (!$routeParams.v || !$routeParams.hack || !$routeParams.for) {
			frp.passResetRequest = true;
			frp.passResetForm = false;
		}
		else{
			frp.passResetForm = true;
			frp.passResetRequest = false;
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
						// calling account service method.
						account
							.passwordResetLink(frp.user.email, response.data.user._id)
							.then((response) => {
								if (response.data.error) {
									frp.resetPassError = true;
									frp.resetPassErrorMsg = response.data.error;
								}
								else{
									frp.resetPassError = false;
									frp.resetSuccessLink = true;
									frp.resetPassSuccessMsg = 'We have sent you a password reset link. Please check your email';
								}
							})
							.catch((err) => alert(err));
					}
				})
				.catch((err) => alert(err));
			}
		}
	}
})();