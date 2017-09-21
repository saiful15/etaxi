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
			startDate: "",
			endDate: "",
			expense_sector: "",
			amount: ""
		};
		
		exvm.addExpense = function () {
			// check at least one expense has been added.
			if(!exvm.expense.startDate || !exvm.expense.endDate || !exvm.expense.expense_sector || !exvm.expense.amount ) {
				exvm.expenseError = true;
				exvm.expenseSuccess = false;
				exvm.errorMessage = "All fields required. Must not be empty";
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
							exvm.expenseSuccessMessage = `£ ${exvm.expense.amount} successfully added for ${exvm.expense.expense_sector}`;
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
						let total = 0; 
						for(var i =0; i < exvm.expensesList.length; i++) {
							total += parseInt(exvm.expensesList[i].amount);
						}
						exvm.totalAmount = total;
					}
					else if(response.data.error) {
						exvm.expenseSummaryError = true;
					}
				})
				.catch(function(err){
					alert(err);
				})
		}
	}
})();
