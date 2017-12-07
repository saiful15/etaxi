/*
|----------------------------------------------
| setting up accountant service.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
(function () {
	angular
		.module('etaxi')
		.service('AccountantService', AccountantService);

	AccountantService.$inject = ['$http'];

	function AccountantService($http) {

		const getCustomers = (email) => {
			return $http 
				.get('api/'+email+'/customers')
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
			getCustomers: getCustomers
		};
	}
})();