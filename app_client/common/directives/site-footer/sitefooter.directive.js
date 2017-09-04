/*
|----------------------------------------------
| sitefooter directive for etaxi accounting
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.directive('siteFooter', siteFooter);

	function siteFooter(){
		return {
			restrict: 'EA',
			templateUrl: "common/directives/site-footer/sitefooter.template.html"
		};
	}
})();