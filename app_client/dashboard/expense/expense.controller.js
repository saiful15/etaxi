/*
|----------------------------------------------
| setting up expense controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('expenseCtrl', expenseCtrl);

	// dependency injection
	expenseCtrl.$inject = ['authentication', 'userservice'];

	function expenseCtrl(authentication, userservice){
		const 	exvm 		=	this;

		exvm.expense = {
			fuel: '',
			car_wash: '',
			car_service: '',
			mot: '',
			car_repair: '',
			insurance: '',
			data_cost: '',
			road_tax: '',
			car_finance: '',
			car_rent: '',
			createdAt: Date.now(),
		};
		
		exvm.addExpense = function () {
			// check at least one expense has been added.
			if(!exvm.expense.fuel && !exvm.expense.car_wash && !exvm.expense.car_service 
				&& !exvm.expense.mot && !exvm.expense.car_repair && !exvm.expense.insurance && 
				!exvm.expense.data_cost && !exvm.expense.road_tax && !exvm.expense.car_finance &&
				!exvm.expense.car_rent) {
				exvm.expenseError = true;
				exvm.errorMessage = "At least one expense needed";
			}
			else{
				exvm.expenseError = false;
				// calling method from userservice service.
				userservice
					.addExpense(authentication.currentUser().email, exvm.expense)
					.then(function(response){
						if(response.data.error) {
							exvm.expenseError = true;
							exvm.errorMessage = "Error while adding expenses for the user";
						}
						else{
							exvm.expenseError = false;
							exvm.expenseSuccess = true;							
						}
					})
					.catch(function(err){
						alert(err);
					})
			}
		}
	}
})();
