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
	profileCtrl.$inject = ['authentication', '$location', 'userservice', '$route'];

	function profileCtrl(authentication, $location, userservice, $route){

		const 	prvm	=	this;

		if(authentication.isLoggedIn()){

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

							console.log(response.data.status);
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

			prvm.niUti 		=	{
				ni_number: "",
				uti_number: ""
			};

			// adding additional information
			prvm.addAdditionalInfo 		=		function(userId){
				if(!prvm.niUti.ni_number || !prvm.niUti.uti_number){
					prvm.additionalInfoError = true;
					prvm.errorMessage = "All fields are required. Must not be empty";
				}
				else{
					prvm.additionalInfoError = false;
					
					// calling method from userservice 
					userservice
						.addAdditionalInformation(userId, prvm.niUti)
						.then(function(response){
							if(response.data.error){
								prvm.additionalInfoError = true;
								prvm.errorMessage 	=	response.data.error;
							}
							else if(response.data.additionalInfo){
								// now update user status.
								prvm.updatedStatus = {
									update_at: "additional_info",
									email: authentication.currentUser().email,
									status: true
								};
								userservice
									.updateUserStatus(prvm.updatedStatus)
									.then(function(response){
										if(response.data.updated === true){
											prvm.showAdditionalInfo = true;
										}
										else{
											prvm.showAdditionalInfo = false;
											prvm.additionalInfoError = true;
											prvm.errorMessage = "Something went wrong with updating user collection status. Contact admin";
										}
									})
									.catch(function(err){
										alert("Error while updating user status collection\t:"+err);
									})
							}
						})
						.catch(function(err){
							alert(err);
						})
				}
			}
		}
		else{
			$location.path('/signin');
		}
	}
})();
