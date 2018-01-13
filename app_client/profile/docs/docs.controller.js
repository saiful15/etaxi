/*
|----------------------------------------------
| setting up docs controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function(){
	angular
		.module('etaxi')
		.controller('docsCtrl', docsCtrl);

	docsCtrl.$inject = ['$window', '$scope', 'authentication', 'userservice', 'fileupload', '$route', '$location'];

	function docsCtrl($window, $scope, authentication, userservice, fileupload, $route, $location) {
		const dcvm = this;

		if(authentication.isLoggedIn()){
			dcvm.noDocs = true;
			dcvm.showUploadForm = false;

			// checking docs are whether available or not.
			dcvm.checkDocs = () => {
				dcvm.docCheckFailed = false;
				// calling user service.
				userservice
					.checkDocuments(authentication.currentUser().userId)
					.then((response) => {
						dcvm.weHaveDocs = true;
						dcvm.noDocs = false;
						dcvm.totalDocs = response.data.doc.length;
						dcvm.docs = response.data.doc;

						dcvm.Files = dcvm.docs.map((file) => {
							return file.docLocation;
						});
					})
					.catch((err) => {
						dcvm.weHaveDocs = false;
						dcvm.docCheckFailed = true;
						dcvm.docCheckErrorMsg = err;
					})
			}

			// upload 
			dcvm.docs = {
				name: '',
				whatFor: '',
				whosFor: '',
				accountDocs: ''
			};
			dcvm.uploadDoc = function (){
				if (!dcvm.docs.name || !dcvm.docs.whatFor || !dcvm.docs.whosFor || !$scope.accountDocs) {
					dcvm.uploaError = true;
					dcvm.uploaErrorMsg = 'All * fields are required. Must not be empty';
				}
				else {
					dcvm.uploaError = false;

					dcvm.uploadInfo = {
						documentId: authentication.currentUser().userId,
						userId: authentication.currentUser().userDirId,
					};
					fileupload
						.uploadAccountDocs($scope.accountDocs, dcvm.uploadInfo.documentId, dcvm.uploadInfo.userId)
						.then((response) => {
							if (response.data.success === false) {
								dcvm.uploaError = false;
								dcvm.uploaErrorMsg = response.data.error;
							}
							else if (response.data.success === true){
								dcvm.docInfo = {
									name: dcvm.docs.name,
									whatFor: dcvm.docs.whatFor,
									whosFor: dcvm.docs.whosFor,
									docId: authentication.currentUser().userId,
									uploader: authentication.currentUser().userId,
									docLocation: response.data.docLocation,
								};
								userservice
									.createDocument(dcvm.docInfo)
									.then((response) => {
										if (response.data.error) {
											dcvm.uploaError = false;
											dcvm.uploaErrorMsg = response.data.error;
										}
										else if (response.data.success) {
											$route.reload();
										}
									})
									.catch((err) => {
										if (err) {
											dcvm.uploaError = true;
											dcvm.uploaErrorMsg = err;
										}
									})
							}
						})
						.catch((err) => {
							if (err) {
								dcvm.uploaError = true;
								dcvm.uploaErrorMsg = err;
							}
						})
				}
			}
		}
		else {
			$location.path('/signin');
		}
	}
})();