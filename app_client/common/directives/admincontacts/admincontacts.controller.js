/*
|----------------------------------------------
| setting up admincontacts controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function() {
	angular
		.module('etaxi')
		.controller('adminContactsCtrl', adminContactsCtrl);

	adminContactsCtrl.$inject = ['userservice'];

	function adminContactsCtrl(userservice) {
		const adcon = this;

		// following function will get all user email address
		adcon.loadAdminContacts = () => {
			userservice
				.adminContact()
				.then((response) => {
					console.log(response);
					adcon.customers = response.data.contacts.filter((customer) => {
						return customer.account_type === 'customer';
					});
					adcon.accountants = response.data.contacts.filter((accountant) => {
						return accountant.account_type === "accountant";
					})
				})
				.catch((err) => {
					alert(err);
				})
		}
	}
})();