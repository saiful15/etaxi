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
			/*
			|----------------------------------------------
			| Following function will search the database
			| based on user input on name or emial
			| @author: jahid haque <jahid.haque@yahoo.com>
			| @copyright: taxiaccounting, 2017
			|----------------------------------------------
			*/
			cvm.search = {
				query: ''
			};
			cvm.searchUser = () => {
				userservice
					.searchUser(cvm.search.query)
					.then((response) => {
						if (response.data.error) {
							cvm.searchError = true;
							cvm.searchErrorMsg = response.data.error;
						}
						else {
							cvm.searchError = false;
							cvm.searchResults = response.data.results;
						}
					})
					.catch((err) => {
						alert(err);
					});
			}
			// load accountant init.
			cvm.initAccounantManagement = () => {
				// calling userservice.
				userservice
					.checkAccountantCollection()
					.then((response) => {
						if (response.data.error) {
							cvm.accountantLoadError = true;
						}
						else {
							cvm.accountantLoadError = false;
							if (response.data.accountant.length === 0) {
								cvm.noAccountant = true;
							}
							else {
								cvm.noAccountant = false;
								cvm.accountantsList = response.data.accountant;
							}
						}

					})
					.catch(err => alert(err));

				// create new accountant.
				cvm.accountant = {
					profile: {
						name: '',
						email: '',
						mobile: '',
					},
					company: {
						company_name: '',
						address: '',
						tel: '',
						company_email: '',
						website: '',
					}
				}
				cvm.addAccountant = () => {
					userservice
						.addAccountant(cvm.accountant)
						.then((response) => {
							if (response.data.error) {
								cvm.addAccountantError = true;
								cvm.addAccountantErrorMsg = response.data.error;
							}
							else {								
								cvm.addAccountantError = false;								
							}
						})
						.catch(err => alert(err));
				}
			}
		}
		else {
			$location.path('/signin');
		}
	}
})();
