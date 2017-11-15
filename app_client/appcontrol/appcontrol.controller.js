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

	ctrlController.$inject = ['userservice', 'authentication', '$location'];

	function ctrlController(userservice, authentication, $location) {
		const cvm = this;
		if (authentication.isLoggedIn() && authentication.currentUser().account_type === 'admin') {
			cvm.initialUserManagement = () => {
				userservice
					.showUsers()
					.then((response) => {
						if (response.data.error) {
							cvm.countError = true;
							cvm.countErrorMsg = response.data.error;
						}
						else {
							cvm.countError = false;
							cvm.userCount = response.data.count;
						}
					})
					.catch((err) => {

					})
			}
		}
		else {
			$location.path('/signin');
		}
	}
})();
