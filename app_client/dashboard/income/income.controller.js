/*
|----------------------------------------------
| setting up income controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('incomeCtrl', incomeCtrl);

	// add dependency to controller
	incomeCtrl.$inject = ['authentication', 'userservice'];

	function incomeCtrl (authentication, userservice) {
		const 	invm 		=	this;

		// income object.
		invm.Income = {
			amount: '',
		};

		invm.addIncome = function () {
			if (!invm.Income.amount) {
				invm.incomeError = true;
				invm.incomeErrorMsg = "Please add income";
			}
			else{
				invm.incomeError = false;
				// calling method from user service service.
				userservice
				 .addIncome(authentication.currentUser().email)
				 .then(function(response) {

				 })
				 .catch(err => {
				 	alert(err);
				 })

			}
		}
	}
})();
