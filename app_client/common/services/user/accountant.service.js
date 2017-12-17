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
		};

		const AccountantProfile = (email) => {
			return $http 
				.get('/api/'+email+'/profile')
				.then(handleSuccess)
				.catch(handleError);
		};

		const editBasicContact = (data) => {
			return $http
				.post('/api/editcontact', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const editCompany = (data) => {
			return $http
				.post('/api/editcompany', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const getCustomer = (userId) => {
			return $http
				.get('api/'+userId+'/custmer')
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
			getCustomers: getCustomers,
			AccountantProfile: AccountantProfile,
			editBasicContact: editBasicContact,
			editCompany: editCompany,
			getCustomer: getCustomer,
		};
	}
})();