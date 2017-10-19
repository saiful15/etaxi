/*
|----------------------------------------------
| setting up account service for user
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

(function(){
	angular
		.module('etaxi')
		.service('account', account);

	account.$inject = ['$http'];

	function account($http) {

		const passwordResetLink = (email, id) => {
			return $http 
				.post('/api/'+email+'/'+id+'/passwordresetlink')
				.then(handleSuccess)
				.catch(handleError);
		}

		const validateResetKey = (key, hash, user) => {
			return $http
				.get('/api/'+user+'/'+key+'/'+hash)
				.then(handleSuccess)
				.catch(handleError);
		}

		function 	handleSuccess(response){
			return response;
		}

		function 	handleError(response){
			return response;
		}

		return {
			passwordResetLink: passwordResetLink,
			validateResetKey: validateResetKey,
		}
	}
})();
