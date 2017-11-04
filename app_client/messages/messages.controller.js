/*
|----------------------------------------------
| setting up message controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

(function () {
	angular
		.module('etaxi')
		.controller('msgController', msgController);

	msgController.$inject = ['authentication', '$location'];

	function msgController (authentication, $location) {
		const msgvm = this;

		if (authentication.isLoggedIn()) {

		}
		else {
			$location.path('/signin');
		}
	}
})();
