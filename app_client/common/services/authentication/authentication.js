/*
|----------------------------------------------------------------
| Setting up angular authentication.
|----------------------------------------------------------------
*/
(function(){

angular
	.module('etaxi')
	.service('authentication', authentication)

// authentication service.
authentication.$inject =['$window', '$http'];

function authentication ($window, $http){

	// saving token.
	var 	saveToken 	=	function(token){
		$window.localStorage['etaxitkn'] = token;
	};

	// get token.
	var 	getToken 	=	function(){
		return $window.localStorage['etaxitkn'];
	};

	// checking user logged in or not.
	var 	isLoggedIn 	=	function(){
		var 	token 	=	getToken();
		var payload;

		if(token){
			payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);
			return payload;
		}
		else{
			return false;
		}
	};


	// get current user details.
	var 	currentUser 	=	function(){
		if(isLoggedIn()){
			var token 	=	getToken();
			var payload =	token.split('.')[1];
				payload =	$window.atob(payload);
				payload =	JSON.parse(payload);
			return {
				userId: payload._id,
				email: payload.email,
				name: payload.name,
				userDirId: payload.userId,
				account_type: payload.account_type
			};
		}
		else{
			return false;
		}
	};

	// calling register end point.
	var 	register 		=	function(user){
		return $http.post('/api/register', user).success(function(data){
			saveToken(data.token);
		});
	};

	// calling login end-point.
	var 	login 		=	function(user){
		return $http.post('/api/login', user).success(function(data){
			saveToken(data.token);
		});
	};

	

	function handleSuccess(response){
		return response;
	}

	function handleError(response){
		return response;
	}

	// removing token on logging out.
	var 	logout 		=	function(){
		$window.localStorage.removeItem('etaxitkn');
	}

	return {
		 currentUser : currentUser,
	      saveToken : saveToken,
	      getToken : getToken,
	      isLoggedIn : isLoggedIn,
	      register : register,
	      login : login,
	      logout : logout
	};

}

})();
