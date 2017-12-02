/*
|----------------------------------------------
| setting up controller for sinlge user admin
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function(){
	angular
		.module('etaxi')
		.controller('usrManageCtrl', usrManageCtrl);

	usrManageCtrl.$inject = ['authentication', 'userservice', 'adminoperation', '$routeParams', '$location'];

	function usrManageCtrl(authentication, userservice, adminoperation, $routeParams, $location) {

		if (authentication.isLoggedIn() && authentication.currentUser().account_type === 'admin') {
			const uvm = this;	
			uvm.weHaveCustomers = false;
			uvm.userDetails = () => {
				userservice
					.getSingleCustomerDetails($routeParams.userid)
					.then((response) => {
						if (response.data.success) {
							uvm.userLoaded = true;
							uvm.user = response.data.user;
						}
						else {
							uvm.userLoaded = false;
						}
					})
					.catch((err) => {
						alert(err);
					})
			}

			// show accountants.
			uvm.showAccountants = () => {
				adminoperation
					.accountants()
					.then((response) => {
						if (response.data.error) {
							uvm.loadAccountantError = true;
							uvm.loadAccountantErrorMsg = `Unable to load accountant(s)`;
						}
						else {
							uvm.loadAccountantError = false;
							uvm.accountants = response.data.accountants;

							// checking if this accountant already has route user.
							uvm.accountants.forEach((accountant) => {
								accountant.customers.forEach((customer) => {
									if (customer.customerid === uvm.user.email) {
										uvm.weHaveCustomers = true;
									}
								});
							});
						}
					})
					.catch((err) => {
						alert(err);
					})
			}

			uvm.assignAccountant = (accountantId) => {
				adminoperation
					.assignAccountantToUser(accountantId, $routeParams.userid)
					.then((response) => {
						if (response.data.error) {
							uvm.accountantAssignmentError = true;
							uvm.accountantAssignmentErrorMsg = response.data.error;
						}
						else {
							uvm.accountantAssignmentError = false;
							uvm.weHaveCustomers = true;
							uvm.accountant = response.data.accountant;
						}
					})
					.catch((err) => {
						alert(err);
					})
			} 
		}
		else{
			$location.path('/signin');
		}
		
	}
})();
