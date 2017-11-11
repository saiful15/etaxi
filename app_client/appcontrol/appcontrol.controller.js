/*
|----------------------------------------------
| setting up app control controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

(function(){
	angular
		.module('etaxi')
		.controller('ctrlController', ctrlController);

	ctrlController.$inject = ['userservice', 'authentication'];

	function ctrlController(userservice, authentication) {
		const cvm = this;

		cvm.usermanagement = true;

		cvm.showUserManager = () => {
			cvm.usermanagement = true;
			cvm.usersearchOn = true;
		}

		cvm.users = {
			search: '',
		};
		cvm.searchuser = () => {
			if (!cvm.users.search) {
				cvm.searchError = true;
				cvm.searchErrorMessage = 'Please enter your name or email address';
			}
			else {
				cvm.usersearchOn = false;
			}
		}
	}
})();
