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
		.controller('signCtrl', signCtrl);

	// dependency
	signCtrl.$inject = ['$location', 'authentication'];

	function signCtrl($location, authentication){
		const 	sgnvm 		=	this;

		sgnvm.newuser 		=	{
			name: "",
			email: "",
			password: ""
		};
		sgnvm.error = false;
		sgnvm.createAccount =	function(){
			if(!sgnvm.newuser.email || !sgnvm.newuser.password){
				sgnvm.error = true;
				sgnvm.errorMessage = "All fields are required. Must not be empty";
			}
			else{
				sgnvm.error = false;
				sgnvm.doRegister();
			}
		}

		// register new user.
		sgnvm.doRegister 	=	function(){
			// calling method from authentication service.
			authentication
				.register(sgnvm.newuser)
				.error(function(err){
					sgnvm.error = true;
					sgnvm.errorMessage = err.error;
				})
				.then(function(response){
					$location.path('/dashboard');
				})
		}

		/*
		|----------------------------------------------------------------
		| don't let logged in user visit registration page.
		|----------------------------------------------------------------
		*/
		if(authentication.isLoggedIn()){
			$location.path('/dashboard');
		}	

	}
})();