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

	forgotPasswordController.$inject = ['userservice'];

	function forgotPasswordController(userservice){
		const 	frp 		=	this;

		// user object.
		frp.user = {
			email: '',
		};
		// check user exists or not.
		frp.checkUser = function (){
			if (!frp.user.email) {
				frp.resetPassError = true;
				frp.resetPassErrorMsg = 'Please enter email address frist';
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
						console.log(response);
					}
				})
				.catch((err) => alert(err));
			}
		}
	}
})();
