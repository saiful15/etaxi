/*
|----------------------------------------------
| setting up navigation controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('navCtrl', navCtrl);

	// add dependency
	navCtrl.$inject 	=	['$location', 'authentication', 'userservice'];

	function navCtrl($location, authentication, userservice){
		const nvm 		=	this;

		nvm.loggedIn  	=	authentication.isLoggedIn()

		nvm.logout 	=	function(){
			authentication.logout();
			$location.path('/signin');
		}

		// checking whether user logged in 
		if(authentication.isLoggedIn()){
			nvm.forLoggedInUser = true;
			nvm.accountType = authentication.currentUser().account_type;
			nvm.name = authentication.currentUser().name;
			// chech whether profile status is true
			// userservice
			// 	.getUserStatus(authentication.currentUser().email)
			// 	.then(function(response){
			// 		console.log(response);
			// 		if(response.data.status){
			// 			if(response.data.status.statusCollection[0].profile === true){
							
			// 				// get user profile
			// 				userservice
			// 					.getProfile(authentication.currentUser().email)
			// 					.then(function(response){
			// 						if(response.data.success === true){
			// 							nvm.userProfileOn 	=	true;
			// 							nvm.userProfile = response.data.profile.profile;
			// 							nvm.username = nvm.userProfile[0].first_name+ " "+nvm.userProfile[0].last_name;
			// 						}
			// 						else{
			// 							nvm.userProfileOn 	=	false;
			// 						}

			// 					})
			// 					.catch(function(err){
			// 						alert(err);
			// 					})
			// 			}
			// 		}
			// 	})
			// 	.catch(function(err){
			// 		alert(err);
			// 	})
		}
	}
})();
