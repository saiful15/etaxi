/*
|----------------------------------------------
| setting up admin service 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function(){
	angular
		.module('etaxi')
		.service('adminoperation', adminoperation);

	adminoperation.$inject = ['$http'];

	function adminoperation($http) {

		const accountants = () => {
			return $http
				.get('/api/accountants')
				.then(handleSuccess)
				.catch(handleError);
		}

		const assignAccountantToUser = (accountantId, userId) => {
			return $http
				.post('/api/'+userId+'/'+accountantId+'/assignaccountant')
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
			accountants: accountants,
			assignAccountantToUser: assignAccountantToUser,
		};
	}
})();