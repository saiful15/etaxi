/*
|----------------------------------------------
| setting up directive for admin contacts
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function () {
	angular
		.module('etaxi')
		.directive('adminContacts', adminContacts);

	function adminContacts() {
		return {
			restrict: 'EA',
			templateUrl: "common/directives/admincontacts/admincontacts.template.html",
			controller: "adminContactsCtrl as adcon"
		}
	}
})();