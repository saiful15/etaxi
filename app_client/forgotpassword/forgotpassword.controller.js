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

	function forgotPasswordController(){
		const 	frp 		=	this;

		// user object.
		frp.user = {
			email: '',
		};
		// check user exists or not.
		frp.checkUser = function (){
			console.log(frp.user);
		}
	}
})();
