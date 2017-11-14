/*
|----------------------------------------------
| setting up expense controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
'use strict';
(function(){
	angular
		.module('etaxi')
		.controller('expenseCtrl', expenseCtrl);

	// dependency injection
	expenseCtrl.$inject = ['$scope', 'authentication', 'userservice', 'fileupload', '$route', '$location'];

	function expenseCtrl($scope, authentication, userservice, fileupload, $route, $location){
		const 	exvm 		=	this;

		if (authentication.isLoggedIn()) {
			exvm.expense = {
				startDate: "",
				expense_sector: "",
				amount: "",
				documentId: '',
				documentDir: '',
				accountImg: '',
			};
		
			exvm.addExpense = function () {
				// check at least one expense has been added.
				if(!exvm.expense || !exvm.expense.expense_sector || !exvm.expense.amount ) {
					exvm.expenseError = true;
					exvm.expenseSuccess = false;
					exvm.errorMessage = "All fields required. Must not be empty";
				}
				else{
					exvm.expenseError = false;
					exvm.expense.accountImg = $scope.accountImg;

					// checking if file exists.
					if (!exvm.expense.accountImg) {
						exvm.pushExpense();
					}
					else {
						// where there is a file to upload.
						exvm.uploadInfo = {
							documentId: authentication.currentUser().userId,
							userId: authentication.currentUser().userDirId,
						};
						fileupload
							.uploadProductFile(exvm.expense.accountImg, exvm.uploadInfo.documentId, exvm.uploadInfo.userId)
							.then((response) => {
								if (response.data.success === true) {
									exvm.expense.documentId = exvm.uploadInfo.documentId;
									exvm.expense.documentDir = response.data.fileLocation;
									exvm.pushExpense();
									$route.reload();
								}
								else {
									exvm.expenseError = true;
									exvm.errorMessage = response.data.error;
								}
							})
							.catch((err) => alert(err));
						
					}
					
				}
			}

			exvm.pushExpense = () => {
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
								total += parseFloat(exvm.expensesList[i].amount);
							}
							exvm.totalAmount = total;

							// now sorting out last 7 days income.
							var last7Days = Last7Days();
							
							let weeklyExpense = last7Days.map(function(date){							
								return exvm.expensesList.filter(function(exp) {
									return exp.startDate === date;
								});
							});

							exvm.weeklyExpense = weeklyExpense.filter(function(expense){
								return expense.length > 0;
							});

							let weeklyExpenseSummary = exvm.weeklyExpense.map((week) => {
								return week.map((day) => {
									return day.amount;
								});							
							});

							const weeklyTotal = weeklyExpenseSummary.map((expense) => {
								return expense.reduce((sum, val) => {
									return sum + val;
								}, 0);
							});

							exvm.weeklyTotalExpenses = weeklyTotal.reduce((sum, value) => {
								return sum + value;
							}, 0);
						}
						else if(response.data.error) {
							exvm.expenseSummaryError = true;
						}
					})
					.catch(function(err){
						alert(err);
					})
			}

			/*
			|----------------------------------------------
			| Following function will get the document 
			| for given user and expense id.
			| @author: jahid haque <jahid.haque@yahoo.com>
			| @copyright: taxiaccounting, 2017
			|----------------------------------------------
			*/
			exvm.getExpenseFile = (expenseId) => {
				userservice
					.showExpenseFile(authentication.currentUser().email, expenseId)
					.then((response) => {

					})
					.catch((err) => alert(err));
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
