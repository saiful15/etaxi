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
		.controller('signinCtrl', signinCtrl);

	// dependency
	signinCtrl.$inject 	=	['authentication', '$location'];

	function signinCtrl(authentication, $location){
		const 	lgvm 		=	this;

		lgvm.user 			=	{
			email: "",
			password: ""
		};

		lgvm.error 			=	false;

		lgvm.letLogin 		=	function(){
			if(!lgvm.user.email || !lgvm.user.password){
				lgvm.error 			=	true;
				lgvm.errorMessage	=	"All fields required. Must not be empty";
			}
			else{
				lgvm.error 			=	false;
				lgvm.doLogin();
			}
		}


		// login function.
		lgvm.doLogin 				=	function(){
			// calling method from authentication service.
			authentication
				.login(lgvm.user)
				.error(function(err){
					lgvm.error 			=	true;
					lgvm.errorMessage 	=	err.error;
				})
				.then(function(){
					$location.path('/dashboard');
				})
		}


		// checking user already logged in or not.
		if(authentication.isLoggedIn()){
			$location.path('/dashboard');
		}
	}
})();