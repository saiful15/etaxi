/*
|----------------------------------------------
| settings controller for the app
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

(function(){
	angular
		.module('etaxi')
		.controller('settingsCtrl', settingsCtrl);
	// adding dependency 
	settingsCtrl.$inject = ['userservice', 'authentication', '$location', '$route'];

	function settingsCtrl(userservice, authentication, $location, $route){
		const 	stvm 		=	this;
		// check user logedin or not.
		if(authentication.isLoggedIn()){
			// get user status collection to check what they need to setup
			stvm.userSetting = () => {
				userservice
					.getUserStatus(authentication.currentUser().email)
					.then(response => {
						if (response.data.error) {
							stvm.initialError = true;
						}
						else {
							stvm.initialError = false;
							stvm.contactSettingOn = response.data.status.statusCollection[0].contact;
							// calling add contact form submission.
							stvm.addContact();

							stvm.businessSettingOn = response.data.status.statusCollection[0].business;
						}
					})
					.catch(err => alert(err));
			}
			// contact object.
				stvm.contact = {
					mobile: '',
					landline: '',
				};
			// add contact form submit
			stvm.addContact = () => {				
				// checking contact is empty or not.
				if(!stvm.contact.mobile) {
					stvm.addContactError = true;
					stvm.addContactErrorMessage = 'All * fields are required';
				}
				else{
					stvm.addContactError = false;
					// calling userservice method to add contact.
					userservice
						.addContactDetails(authentication.currentUser().email, stvm.contact)
						.then(response => {
							if (response.data.error) {
								stvm.addContactError = true;
								stvm.addContactErrorMessage = response.data.error.name;
							}
							else {
								// now update user status collection for contact.
								const updateStatus = {
									update_at: "contact",
									email: authentication.currentUser().email,
									status: true
								}
								userservice
									.updateUserStatus(updateStatus)
									.then(response => {
											if(response.data.updated === true) {
												$route.reload();
											}
											else {
												stvm.addContactError = true;
												stvm.addContactErrorMessage = 'Error! while updating status collection';
											}
									})
									.catch(err => alert(err));
							}
						})
						.catch(err => alert(err));
				}
			}

			// show contact details.
			stvm.showContactDetails = () => {
				userservice
					.showContact(authentication.currentUser().email)
					.then(response => {
 						if (response.data.error) {
 							stvm.showContactError = true;
 						}
 						else {
 							stvm.showContactError = false;
 							stvm.userContactDetails = response.data.data;
 						}
					})
					.catch(err => alert(err));
			}

			stvm.businessInfo = {
				name: '',
				type: '',
			};
			// add business info 
			stvm.addBusinessInfoSubmit = () => {
				// calling userservice method to add business name and type
				userservice
					.addBusinessInfo(authentication.currentUser().email, stvm.businessInfo)
					.then(response => {
						if (response.data.error) {
							stvm.business_infAddingError = true;
							stvm.businessInfErMgm = response.data.error.name+' '+response.data.error.details[0].message;
						}
						else {
							// now update user status collection for contact.
							const updateStatus = {
								update_at: "business",
								email: authentication.currentUser().email,
								status: true
							}
							userservice
								.updateUserStatus(updateStatus)
								.then(response => {
									if(response.data.updated === true) {
										$route.reload();
									}
									else {
										stvm.business_infAddingError = true;
									}
								})
								.catch(err => alert(err));
						}
					})
					.catch(err => alert(err));
			}
		}
		else{
			$location.path('/signin');
		}
	}
})();
