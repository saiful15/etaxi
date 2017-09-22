/*
|----------------------------------------------
| setting up service for system
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: ncl, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.service('userservice', userservice);

	//dependency 
	userservice.$inject = ['$http'];

	function userservice($http){

		var				getUserStatus 		=		function(email){
			return $http
					.get('/api/userstatus/'+email)
					.then(handleSuccess)
					.catch(handleError);
		};


		var 			updateUserStatus 	=		function(updateData){
			return $http
					.post('/api/userstatus/',updateData)
					.then(handleSuccess)
					.catch(handleError);
		}

		var 			updateAddress		=		function(userId, updatedAddressData){
			return $http	
					.post('/api/updateaddress/'+userId, updatedAddressData)
					.then(handleSuccess)
					.catch(handleError);
		}

		var 			saveProfile 		=		function(email, data){
			return $http
					.post('/api/saveprofile/'+email, data)
					.then(handleSuccess)
					.catch(handleError);
		};

		var 			getProfile 			=		function(email){
			return 	$http
						.get('/api/userprofile/'+email)
						.then(handleSuccess)
						.catch(handleError);
		}

		var 	addAdditionalInformation 	=		function(userId, data){
			return 	$http
						.post('/api/addaditionalinfo/'+userId, data)
						.then(handleSuccess)
						.catch(handleError);
		}

		// add expense for the users.
		var addExpense = function (userId, data) {
			return $http
				.post('/api/addexpense/'+userId, data)
				.then(handleSuccess)
				.catch(handleError);
		}

		// show expens.
		var showExpenseSummary = function (userId) {
			return $http
				.get('/api/showexpense/'+userId)
				.then(handleSuccess)
				.catch(handleError);
		}

		// add income
		var addIncome = function (userId) {
			return $http
				.post('/api/'+userId+'/addincome')
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
			getUserStatus: getUserStatus,
			saveProfile: saveProfile,
			updateUserStatus: updateUserStatus,
			getProfile: getProfile,
			updateAddress: updateAddress,
			addExpense: addExpense,
			showExpenseSummary: showExpenseSummary,
			addIncome: addIncome,
			addAdditionalInformation: addAdditionalInformation
		};
	}
})();
