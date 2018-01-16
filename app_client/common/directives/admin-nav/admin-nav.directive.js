/*
|----------------------------------------------
| setting up admin navigation directive
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2018
|----------------------------------------------
*/

'use strict';

(function(){
	angular
		.module('etaxi')
		.directive('adminNav', adminNav);

	function adminNav(){
		return {
			restrict: 'EA',
			templateUrl: "common/directives/admin-nav/admin-nav.template.html",
			controller: "adminNavCtrl as anvm"
		}
	}
})();