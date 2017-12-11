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

	adminContactsCtrl.$inject = ['userservice', 'authentication'];

	function adminContactsCtrl(userservice, authentication) {
		const adcon = this;

		adcon.ContactType = authentication.currentUser().account_type;

		if (adcon.ContactType === 'admin') {
			adcon.loadAllContact = true;
			adcon.loadAccountantContact = true;
			adcon.loadCustomerContact = false;
		}
		else if (adcon.ContactType === 'accountant') {
			adcon.loadAllContact = false;
			adcon.loadCustomerContact = true;
			adcon.loadAccountantContact = false;
		}

		// following function will get all user email address
		adcon.loadAdminContacts = () => {
			userservice
				.adminContact()
				.then((response) => {							
					adcon.loadAccountantContact = true;
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