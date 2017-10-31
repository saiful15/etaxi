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
			expense_sector: "",
			amount: ""
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
							total += parseFloat(exvm.expensesList[i].amount);
						}
						exvm.totalAmount = total;

						// now sorting out last 7 days income.
						var last7Days = Last7Days();
						let weeklyExpenses = last7Days.map(function(x){
							return exvm.expensesList.filter(function(expense){
								return formatDateFromISO(expense.createdAt) === x;
							});
						});

						exvm.weeklyExpense = weeklyExpenses.filter(function(expense){
							return expense.length > 0;
						});
					}
					else if(response.data.error) {
						exvm.expenseSummaryError = true;
					}
				})
				.catch(function(err){
					alert(err);
				})
		}

		function formatDateFromISO(date) {
		    var d = new Date(date),
		        month = '' + (d.getMonth() + 1),
		        day = '' + d.getDate(),
		        year = d.getFullYear();

		    if (month.length < 2) month = '0' + month;
		    if (day.length < 2) day = '0' + day;

		    return [year, month, day].join('-');
		}

		// function to formate date.
		function formatDate(date){
		    var dd = date.getDate();
		    var mm = date.getMonth()+1;
		    var yyyy = date.getFullYear();
		    if(dd<10) {dd='0'+dd}
		    if(mm<10) {mm='0'+mm}
		    date = yyyy+'-'+mm+'-'+dd;
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
})();
