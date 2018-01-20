/*
|----------------------------------------------
| setting up allexpenses controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etax, 2018
|----------------------------------------------
*/

'use strict';

(function () {

    angular
		.module('etaxi')
		.controller('allexpensesCtrl', allexpensesCtrl);

	 allexpensesCtrl.$inject = ['authentication', 'userservice', '$location', '$filter'];

	 function allexpensesCtrl(authentication, userservice, $location, $filter) {

	 	const exlVm = this;

	 	if(authentication.isLoggedIn()){
	 		exlVm.showEditArea = false;
	 		exlVm.showExpenseList = true;
	 		// load user expense summary 
			exlVm.loadExpenseSummary = function() {
				// calling method user service to load expense summary.
				userservice
					.showExpenseSummary(authentication.currentUser().email)
					.then(function(response){
						if(response.data.success === true){
							exlVm.expenseSummaryError = false;
							exlVm.expenseSummarySuccess = true;
							exlVm.expensesList = response.data.expense;
							let total = 0; 
							for(var i =0; i < exlVm.expensesList.length; i++) {
								total += parseFloat(exlVm.expensesList[i].amount);
							}
							exlVm.totalAmount = total;

							// now sorting out last 7 days income.
							var last7Days = Last7Days();
							
							let weeklyExpense = last7Days.map(function(date){							
								return exlVm.expensesList.filter(function(exp) {
									return exp.startDate === date;
								});
							});

							exlVm.weeklyExpense = weeklyExpense.filter(function(expense){
								return expense.length > 0;
							});

							let weeklyExpenseSummary = exlVm.weeklyExpense.map((week) => {
								return week.map((day) => {
									return day.amount;
								});							
							});

							const weeklyTotal = weeklyExpenseSummary.map((expense) => {
								return expense.reduce((sum, val) => {
									return sum + val;
								}, 0);
							});

							exlVm.weeklyTotalExpenses = weeklyTotal.reduce((sum, value) => {
								return sum + value;
							}, 0);
						}
						else if(response.data.error) {
							exlVm.expenseSummaryError = true;
						}
					})
					.catch(function(err){
						alert(err);
					})
			}


			exlVm.editExpense = (expenseId) => {
				exlVm.showEditArea = true;
	 			exlVm.showExpenseList = false;

	 			// calling method from userservice to load data for given income id
				userservice
					.showSinlgeExpense(authentication.currentUser().email, expenseId)
					.then(response => {
						console.log(response);
						if(response.data.error) {
							exlVm.editDataLoadError = true;
							exlVm.editDataLoadErrorMessage = response.data.error;
						}
						else if(response.data.success === true) {
							exlVm.editDataLoadError = false;
							// load initial data for given income id.							
							exlVm.expenseEdit = {
								expenseDate: response.data.data[0].startDate,
								amount: response.data.data[0].amount,
							};
						}
					})
					.catch(err => {
						alert(err);
					})
			}


			exlVm.cancelEdit = () => {
				exlVm.showEditArea = false;
	 			exlVm.showExpenseList = true;
			}


			// function to formate date.
			function formatDate(date){
			    var dd = date.getDate();
			    var mm = date.getMonth()+1;
			    var yyyy = date.getFullYear();
			    if(dd<10) {dd='0'+dd}
			    if(mm<10) {mm='0'+mm}
			    date = dd+'-'+mm+'-'+yyyy;
			    return date;
	 		}
	 		// get last 7 days.
	 		function Last7Days () {
			    var result = [];
			    for (var i=0; i<7; i++) {
			        var d = new Date();
			        d.setDate(d.getDate() - i);
			        result.push( formatDate(d) )
			    }
			    return result;
			 }

	 	}
	 	else {
	 		$location.path('/signin');
	 	}

	 }


})();