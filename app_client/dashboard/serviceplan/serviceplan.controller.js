/*
|----------------------------------------------
| controller for service plan
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiacconting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('servicePlanCtrl', servicePlanCtrl);

	servicePlanCtrl.$inject = ['authentication', '$location'];

	function servicePlanCtrl(authentication, $location){

		const 	srvm		=		this;

		if(authentication.isLoggedIn()){

			srvm.loadServicePlan 		=		function(service_plan){
				srvm.service_plan 		=		true;
				srvm.plan 				=		service_plan;
			}
		}
		else{
			$location.path('/signin');
		}
	}
})();