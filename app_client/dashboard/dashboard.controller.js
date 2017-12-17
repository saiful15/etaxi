/*
|----------------------------------------------
| setting up home controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('dashboardCtrl', dashboardCtrl);

	// dependency
	dashboardCtrl.$inject 	=	['authentication', '$location', 'userservice', 'AccountantService', '$routeParams'];

	function dashboardCtrl(authentication, $location, userservice, AccountantService, $routeParams){
		const 	dsvm 		=	this;

		// chekcing if user logged in or not.
		if(authentication.isLoggedIn()){
			// when logged in user is customer.
			if(authentication.currentUser().account_type === 'customer'){
				dsvm.customerOpr = true;
				dsvm.adminOpr = false;
				dsvm.accountantOpr = false;
				dsvm.getUserStatus 	=	function(){
					// calling user service method 
					userservice
						.getUserStatus(authentication.currentUser().email)
						.then(function(response){
							if(response.data.error){
								dsvm.statusError = true;
								dsvm.statusErrorMessage = response.data.error;
							}
							else if(response.data.status){
								dsvm.statusCollection = response.data.status.statusCollection;
							}
						})
						.catch(function(err){
							alert(err);
						})
				}

				// calling getUserStatus method.
				dsvm.getUserStatus();

				dsvm.userProfile 	=	{
					first_name: "",
					last_name: "",
					house_no: "",
					street_name: "",
					city_name: "",
					county: "",
					postcode: "",
				};
				
				dsvm.createProfile 		=	function(){
					// ajax loader
					dsvm.showAjaxLoader =	true;
					dsvm.btnDisabled 	=	true;
					
					if(!dsvm.userProfile.first_name || !dsvm.userProfile.last_name || !dsvm.userProfile.house_no
						|| !dsvm.userProfile.street_name || !dsvm.userProfile.city_name || 
						!dsvm.userProfile.county || !dsvm.userProfile.postcode){
						dsvm.profileError = true;
						dsvm.profileErrorMessage = "All fields are required. Must not be empty";

						dsvm.showAjaxLoader =	false;
						dsvm.btnDisabled 	=	false;
					}
					else{
						dsvm.profileError = false;

						// hold the process for 2 sec
						setTimeout(function(){
							dsvm.showAjaxLoader =	false;
							dsvm.btnDisabled 	=	false;

							// calling method from userservice 
							userservice	
								.saveProfile(authentication.currentUser().email, dsvm.userProfile)
								.then(function(response){
									if(response.data.error){
										dsvm.profileError = true;
										dsvm.profileErrorMessage = response.data.error;
									}
									else if(response.data.profile){	
										dsvm.profileError 		= 	false;
										dsvm.profileSuccess 	= 	true;
										dsvm.successMessage =	"Your profile successfully created";

										// // calling updateStatus method.
										var 	updateData = {
											update_at: "profile",
											email: authentication.currentUser().email,
											status: true
										};

										if(dsvm.updateStatus(updateData) === false){											
											dsvm.profileError 		= 	true;
											dsvm.profileErrorMessage = "Something went wrong, updating your profile. Please contact admin";
										}
										else{
											dsvm.getUserStatus();
										}
									}
								})
								.catch(function(err){
									alert(err);
								})
						}, 500);
					}
				}


				// function which will update the status collection according to given details.
				dsvm.updateStatus 		=	function(data){
					let 	updated;
					// calling method from user service.
					userservice
						.updateUserStatus(data)
						.then(function(response){
							if(response.data.updated === true){
								updated =  true;
							}
							else{
								updated =  false;
							}
						})
						.catch(function(err){
							alert(err);
						})
					return updated;
				}
			}
			// when logged in user is admin
			else if(authentication.currentUser().account_type === 'admin'){
				dsvm.adminOpr = true;
				dsvm.accountantOpr = false;
			}
			else if (authentication.currentUser().account_type === 'accountant')	{
				dsvm.accountantOpr = true;

				// load customers.
				dsvm.loadCustomers = () => {
					AccountantService
						.getCustomers(authentication.currentUser().email)
						.then((response) => {
							if (response.data.error) {
								dsvm.loadCustomerError = true;
								dsvm.loadCustomerErrorMsg = response.data.error;
							}
							else {
								dsvm.loadCustomerError = false;
								dsvm.assignedCustomers = response.data.customers;
							}
						})
						.catch((err) => alert(err));
				}
				dsvm.LoadCustomerProfile = false;
				// checking routeParams.
				if ($routeParams.cus) {
					dsvm.LoadCustomerProfile = true;
					AccountantService
						.getCustomer($routeParams.cus)
						.then((response) => {
							if (response.data.error) {
								dsvm.customerInfoLoadError = true;
								dsvm.customerInfoLoadErrorMsg = response.data.error;
							}
							else {
								dsvm.customerInfoLoadError = false;
								dsvm.LoadedCustomer = response.data.userInfo;
							}
						})
						.catch((err) => {
							alert(err);
						})
					dsvm.showCustomerIncome = false;
					// load income statement for give user.
					dsvm.loadIncomeStatement = (customerEmail) => {
						dsvm.showCustomerIncome = true;
						userservice
							.showIncome(customerEmail)
							.then((response) => {
								if (response.data.error) {
									dsvm.erroLoadingCustomerIncome = true;
									dsvm.erroLoadingCustomerIncomeMsg = response.data.error;
								}
								else {
									dsvm.erroLoadingCustomerIncome = false;
									dsvm.CustomerIncome = response.data.data;
								}
							})
							.catch((err) => {
								alert(err);
							})
					}
				}

			}
		}
		else{
			$location.path('/signin');
		}

	}
})();
