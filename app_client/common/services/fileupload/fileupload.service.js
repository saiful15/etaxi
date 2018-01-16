/*
|----------------------------------------------
| setting up fileupload service.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

(function(){
	angular
		.module('etaxi')
		.service('fileupload', fileupload);

	fileupload.$inject = ['$http'];

	function fileupload($http){

		var 		uploadProductFile 		=		function(file, documentId, userId){
			var fd = new FormData();
	        fd.append('accountImg', file);

	        return $http
	        			.post('/api/fileupload/'+documentId+'/'+userId, fd, {
	        				transformRequest: angular.identity,
            				headers: { 'Content-Type': undefined }
	        			})
	        			.then(handleSuccess)
	        			.catch(handleError);
		}

		const uploadAccountDocs = (file, documentId, userId) => {
			var fd = new FormData();
	        fd.append('accountDocs', file);

	        return $http
	        			.post('/api/docupload/'+documentId+'/'+userId, fd, {
	        				transformRequest: angular.identity,
            				headers: { 'Content-Type': undefined }
	        			})
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
			uploadProductFile: uploadProductFile,
			uploadAccountDocs: uploadAccountDocs
		}
	}

})();
