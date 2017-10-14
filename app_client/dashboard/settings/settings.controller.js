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
							stvm.vehicleSettingOn = response.data.status.statusCollection[0].vehicle;
							stvm.insuranceSettingOn = response.data.status.statusCollection[0].insurance;
							stvm.lisenceSettingOn = response.data.status.statusCollection[0].lisence;

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

			// show basic business information.
			stvm.showBusinessBasic = () => {
				// calling user service method.
				userservice
					.showBusinessBasic(authentication.currentUser().email)
					.then(response => {
						if (response.data.error) {
							stvm.businessBasicInfoError = true;
							stvm.businessBasicInfoErrorMsg = response.data.error;
						}
						else{
							stvm.businessBasicInfoError = false;
							stvm.businessBasicInfoList = response.data.data;
						}
					})
					.catch(err => alert(err));
			}

			// vechile details.
			stvm.vehicle = {
				type: '',
				brand: '',
				registration: '',
				car_value: '',
				mot: '',
				roadtax: '',
				car_status: '',
			}

			// show vichle details.
			stvm.addVechicleDetails = () => {
				userservice
					.addVehicleInfo(authentication.currentUser().email, stvm.vehicle)
					.then(response => {
						if (response.data.error) {
							stvm.vehicleError = true;
							if (response.data.error.isJoi === true){
								stvm.vehicleErrorMsg = response.data.error.details[0].message;
							}
							else{
								stvm.vehicleErrorMsg = response.data.error;
							}
						}
						else if(response.data.success === true) {
							
							// now update user status collection for contact.
							const updateStatus = {
								update_at: "vehicle",
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
										stvm.vehicleError = true;
										stvm.vehicleErrorMsg = 'Failed to update user status for vehicle. Contact admin';
									}
								})
								.catch(err => alert(err));
						}
					})
					.catch(err => alert(err));
			}

			// show vehicle details.
			stvm.getVehicle = () => {
				userservice
					.showVehicle(authentication.currentUser().email)
					.then(response => {
						if (response.data.error) {
							stvm.showVehicleError = true;
							stvm.showVehicleErrorMgm = response.data.error;
						}
						else if(response.data.success === true) {
							stvm.showVehicleError = false;
							stvm.vehicleList = response.data.data;
						}
					})
					.catch(err => alert(err));
			}

			// to add insurance details to user collection.
			stvm.insurance = {
				name: '',
				valid_date: '',
				number: '',
			};
			stvm.addInsurance = () => {
				// calling method from userservice.
				userservice
					.addInsurance(authentication.currentUser().email, stvm.insurance)
					.then(response => {
						if (response.data.error) {
							stvm.addInsuranceErr = true;
							if (response.data.error.isJoi === true) {
								stvm.insuranceErrMgs = response.data.error.details[0].message;
							}
							else{
								stvm.insuranceErrMgs = response.data.error;
							}
						}
						else if (response.data.success === true) {
							stvm.addInsuranceErr = false;

							// now update user status collection for contact.
							const updateStatus = {
								update_at: "insurance",
								email: authentication.currentUser().email,
								status: true,
							};
							userservice
								.updateUserStatus(updateStatus)
								.then(response => {
									if(response.data.updated === true) {
										$route.reload();
									}
									else {
										stvm.addInsuranceErr = true;
										stvm.insuranceErrMgs = 'Failed to update user status for vehicle. Contact admin';
									}
								})
								.catch(err => alert(err));
						}
					})
					.catch(err => alert(err));
			}

			// show insurance.
			stvm.showInsurance = () => {
				// calling userservice method to get insurance details.
				userservice
					.showInsurance(authentication.currentUser().email)
					.then(response => {
						if (response.data.error) {
							stvm.showInsuraceError = true;
							if (response.data.error.isJoi === true) {
								stvm.showInsuraceErrorMsg = response.data.error.details[0].message;
							}
							else {
								stvm.showInsuraceErrorMsg = response.data.error;
							}
						}
						else if(response.data.success === true) {
							stvm.showInsuraceError = false;
							stvm.insuraceList = response.data.insurance;
						}
					})
					.catch(err => alert(err));
			}

			// to add lisence information.
			stvm.lisence = {
				dvla: '',
				taxi_type: '',
				valid_till: '',
			};
			stvm.addLisence = () => {
				userservice
					.addLisence(authentication.currentUser().email, stvm.lisence)
					.then((response) => {
						if (response.data.error) {
							stvm.lisenceError = true;
							if (response.data.error.isJoi === true) {
								stvm.lisenceErrorMsg = response.data.error.details[0].message;
							}
							else{
								stvm.lisenceErrorMsg = response.data.error;
							}
						}
						else{
							stvm.lisenceError = false;
							// now i wanna update lisence status in status collection.
							// now update user status collection for contact.
							const updateStatus = {
								update_at: "lisence",
								email: authentication.currentUser().email,
								status: true,
							};
							userservice
								.updateUserStatus(updateStatus)
								.then(response => {
									if(response.data.updated === true) {
										$route.reload();
									}
									else {
										stvm.lisenceError = true;
										stvm.lisenceErrorMsg = 'Failed to update user status for vehicle. Contact admin';
									}
								})
								.catch(err => alert(err));
						}
					})
					.catch(err => alert(err));
			};

			// show lisence information.
			stvm.showLisence = () => {
				userservice
					.userLisence(authentication.currentUser().email)
					.then((response) => {
						if (response.data.error) {
							stvm.lisenceLoadError = true;
							if (response.data.error.isJoi === true) {
								stvm.lisenceLoadErrorMsg = response.data.error.details[0].message;
							}
							else {
								stvm.lisenceLoadErrorMsg = response.data.error;
							}
						}
						else {
							stvm.lisenceLoadError = false;
							stvm.lisenceInfo = response.data.lisence;
						}
					})
					.catch((err) => alert(err));
			}

		}
		else{
			$location.path('/signin');
		}
	}
})();
