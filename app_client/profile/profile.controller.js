/*
|----------------------------------------------
| setting up profile controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('profileCtrl', profileCtrl);

	// dependency injection
	profileCtrl.$inject = ['authentication', '$location', 'userservice', '$route', 'AccountantService'];

	function profileCtrl(authentication, $location, userservice, $route, AccountantService){

		const 	prvm	=	this;

		if(authentication.isLoggedIn()){

			prvm.AccountType = authentication.currentUser().account_type;
			
			// function to check user status collection.
			prvm.getUserStatusCollection 	=	function(){

				// calling user service location to get user status.
				userservice
					.getUserStatus(authentication.currentUser().email)
					.then(function(response){
						if(response.data.error){
							prvm.profileLoadError = true;
						}
						else if(response.data.status){
							prvm.profileLoadError = false;
							prvm.profileOn = response.data.status.statusCollection[0].profile;

							// additional info prompt.
							prvm.additionInfo = response.data.status.statusCollection[0].additional_info;

							// calling method from user service 
							userservice
								.getProfile(authentication.currentUser().email)
								.then(function(response){
									if(response.data.error){
										prvm.personalProfile = true;
										prvm.addressEditForm 	=	false;
									}
									else if(response.data.success){
										prvm.addressEditForm 	=	false;
										prvm.personalProfile = false;
										prvm.showPersonalProfile = true;
										prvm.personProfileDetails = response.data.profile;
										prvm.showAddress	=	true;
									}
								})
								.catch(function(err){
									alert(err);
								})
						}
					})
					.catch(function(err){
						alert(err);
					})
			}
			// edit address.
			prvm.editAddress 		=		function(){
				prvm.showAddress	=	false;
				prvm.addressEditForm 	=	true;
			}
			prvm.personDetails 	=		{
				house_number: "",
				street_name: "",
				post_code: "",
				city: "",
				county: ""
			};
			prvm.saveAddressChange 	=	function(userId){
				if(!prvm.personDetails.house_number || !prvm.personDetails.street_name || !prvm.personDetails.post_code 
					|| !prvm.personDetails.city || !prvm.personDetails.county){
					prvm.editAddressError 	=	true;
					prvm.erroMessage = "Error! All fields are required";
				}
				else{
					prvm.editAddressError 	=	false;
					// calling userservice method to update the address.
					userservice
						.updateAddress(userId, prvm.personDetails)
						.then(function(response){
							if(response.data.error){
								prvm.editAddressError = true;
								prvm.erroMessage = response.data.error;
							}
							else if(response.data.success){
								prvm.editAddressError = false;
								$route.reload();
							}
						})
						.catch(function(err){
							alert(err);
						})
				}
			}

			prvm.cancelAddressForm 		=		function(){
				prvm.showAddress	=	true;
				prvm.addressEditForm 	=	false;
			}

			

			/*
			|----------------------------------------------
			| Following function will get accoutant's prof-
			| ile based on given email address
			|----------------------------------------------
			*/
			prvm.AccountantBasicContactEditOn = false;
			prvm.AccountantCompanyEditOn = false;
			prvm.LoadAccountantProfile = () => {
				AccountantService
					.AccountantProfile(authentication.currentUser().email)
					.then((response) => {
						if (response.data.error) {
							prvm.AccoutantLoadError = true;
						}
						else {
							prvm.AccoutantLoadError = false;
							prvm.accountant = response.data.accountant;
						}
					})
					.catch((err) => {
						alert(err);
					});
			};

			prvm.editAccountantBasicContact = () => {
				prvm.AccountantBasicContactEditOn = true;
			};

			prvm.cancelAccountantBasicContact = () => {
				prvm.AccountantBasicContactEditOn = false;
			};

			// save change
			prvm.saveAccountantBasicContact = () => {
				const basicInfo = {
					name: prvm.accountant.name,
					mobile: prvm.accountant.mobile,
					email: authentication.currentUser().email,
				};
				AccountantService
					.editBasicContact(basicInfo)
					.then((response) => {
						if (response.data.error) {
							prvm.AccountantBasicSaveError = true;
							prvm.AccountantBasicSaveErrorMsg = response.data.error;
						}
						else if (response.data.success) {
							prvm.AccountantBasicSaveError = false;
							$route.reload();
						}
					})
					.catch((err) => {
						alert(err);
					});
			};
			/*
			|----------------------------------------------
			| Edit accoutant company info
			|----------------------------------------------
			*/
			prvm.editAccountantCompany = () => {
				prvm.AccountantCompanyEditOn = true;
			};
			prvm.cancelAccountantCompany = () => {
				prvm.AccountantCompanyEditOn = false;
			};
			prvm.saveAccountantCompany = () => {
				const accountantCompany = {
					name: prvm.accountant.company[0].name,
					address: prvm.accountant.company[0].address,
					email: prvm.accountant.company[0].email,
					useremail: authentication.currentUser().email,
					website: `http://${prvm.accountant.company[0].website}`,
					Tel: prvm.accountant.company[0].tel,
				};
				AccountantService
					.editCompany(accountantCompany)
					.then((response) => {
						if (response.data.error) {
							prvm.AccountantCompanySaveError = true;
							prvm.AccountantCompanySaveErrorMsg = response.data.error;
						}
						else {
							prvm.AccountantCompanySaveError = false;
							$route.reload();
						}
					})
					.catch((err) => {
						alert(err);
					});

			};
		}
		else{
			$location.path('/signin');
		}
	}
})();
