/*
|----------------------------------------------
| setting up controller for accountant page
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function(){
	angular
		.module('etaxi')
		.controller('accountantCtrl', accountantCtrl);

	accountantCtrl.$inject = ['authentication', 'userservice', '$routeParams', '$location', '$route'];

	function accountantCtrl(authentication, userservice, $routeParams, $location, $route) {
		if (authentication.isLoggedIn() && authentication.currentUser().account_type === 'admin') {
			const acvm = this;
			acvm.loadAccountant = () => {
				acvm.AccountantId = $routeParams.accountantId;

				// calling userservice.
				userservice
					.accountantProfile(acvm.AccountantId)
					.then((response) => {
						acvm.accountantInfo = response.data.accountant;
						// when we have customers. 
						if (acvm.accountantInfo.customers.length < 1 ) {
							acvm.noCustomers = true;
						}
						else {
							acvm.noCustomers = false;
						}
					})
					.catch((err) => alert(err));
			}

			// create accountant login details.
			acvm.createLoginForAccountant = () => {
				acvm.accountantLoginInfo = {
					email: acvm.accountantInfo.email,
					account_type: 'accountant'
				};
				userservice
					.createAccountantLogin(acvm.accountantLoginInfo)
					.then((response) => {
						if (response.data.success) {
							acvm.accountantCreationSuccess = true;
							acvm.accountantCreationError = false;
							acvm.accountantCreationSuccessMsg = `Account successfully create. 
							Ask accountant to check ${acvm.accountantLoginInfo.email}`;

							// now Set a timeout and call UpdateAccountantLoingCrated
							setTimeout(() =>{
								acvm.UpdateAccountantLoginCreated();
							},500);
						}
						else {
							acvm.accountantCreationError = true;
							acvm.accountantCreationSuccess = false;
							acvm.accountantCreationErrorMsg = response.data.error;
						}
					})
					.catch((err) => {
						alert(err);
					})
			}

			// update accouantant login created status.
			acvm.UpdateAccountantLoginCreated = () => {
				userservice
					.updateLoginAccountantCreation($routeParams.accountantId)
					.then((response) => {
						if (response.data.success) {
							// reload the current page.
							$route.reload();
						}
					})
					.catch((err) => {
						alert(err);
					})
			}
		}
		else {
			$location.path('/signin');
		}

	}
})();