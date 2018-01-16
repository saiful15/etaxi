/*
|----------------------------------------------
| setting up admin nav controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2018
|----------------------------------------------
*/

'use strict';

(function(){
	angular
		.module('etaxi')
		.controller('adminNavCtrl', adminNavCtrl);

	// add dependency
	adminNavCtrl.$inject 	=	['$location', 'authentication', 'userservice'];

	function adminNavCtrl($location, authentication, userservice){
		const anvm 		=	this;

		anvm.loggedIn  	=	authentication.isLoggedIn()

		anvm.logout 	=	function(){
			authentication.logout();
			$location.path('/signin');
		}

		// checking whether user logged in 
		if(authentication.isLoggedIn()){
			anvm.forLoggedInUser = true;
			anvm.accountType = authentication.currentUser().account_type;
			anvm.name = authentication.currentUser().name;
			
		}
	}
})();
