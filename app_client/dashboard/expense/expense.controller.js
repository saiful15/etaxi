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
			totalAt: '',
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
				var InputedValueList = [];
				var total=0;
				
				for(var key in exvm.expense){
					if(exvm.expense.hasOwnProperty(key)){
						if(exvm.expense[key] !== ''){
							InputedValueList.push(exvm.expense[key]);
						}
					}
				}
				
				for(var i =0; i < InputedValueList.length; i++) {
					total += parseInt(InputedValueList[i]);
				}
				exvm.expense.totalAt = total;

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
							exvm.loadExpenseSummary();						
						}
					})
					.catch(function(err){
						alert(err);
					})
			}
		}

		// load user expense summary 
		exvm.loadExpenseSummary = function() {
			// calling method user service to load expense summary.
			userservice
				.showExpenseSummary(authentication.currentUser().email)
				.then(function(response){
					if(response.data.success === true){
						exvm.expenseSummaryError = false;
						exvm.expenseSummarySuccess = true;
						exvm.expensesList = response.data.expense;
						exvm.totalExpense = 0;
						for(var i =0; i < exvm.expensesList.length; i++) {
							exvm.totalExpense += parseInt(exvm.expensesList[i].totalAt);
						}
					}
					else if(response.data.error) {
						exvm.expenseSummaryError = true;
					}
				})
				.catch(function(err){

				})
		}
	}
})();
