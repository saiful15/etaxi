/*
|----------------------------------------------
| setting up system service
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

(function(){
	angular
		.module('etaxi')
		.service('systemService', systemService);

	systemService.$inject = ['$http'];

	function systemService ($http) {
		const contactMessage = (data) => {
			return $http
				.post('/api/contact', data)
				.then(handleSuccess)
				.catch(handleError);
		}

		function handleSuccess(response) {
			return response;
		}

		function handleError(response) {
			return response;
		}
		return {
			contactMessage: contactMessage,
		};
	}
})();
