/*
|----------------------------------------------
| setting up taxreturn controller 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/

'use strict';

(function () {
	angular
		.module('etaxi')
		.controller('taxController', taxController);

	taxController.$inject 	=	['authentication', '$location', 'userservice'];

	function taxController(authentication, $location, userservice) {
		const txvm = this;

		if (authentication.isLoggedIn()) {

			// calling userservice.
			userservice
					.showEstimatedTax(authentication.currentUser().email)
					.then((response) => {
						if (response.data.error) {
							txvm.loadTaxReturnError = true;
							txvm.loadTaxReturnErrorMsg = response.data.error;
						}
						else {
							txvm.taxInfo = response.data;
						}
					})
					.catch((err) => {
						txvm.loadTaxReturnError = true;
						txvm.loadTaxReturnErrorMsg = err;						
					})
		}
		else {
			$location.path('/signin');
		}
	}
})();