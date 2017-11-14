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
		if (authentication.isLoggedIn()) {
						
		}
		else {
			$location.path('/signin');
		}
	}
})();
