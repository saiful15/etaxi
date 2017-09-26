/*
|----------------------------------------------
| setting up controller for all income statements
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
(function () {
	angular
		.module('etaxi')
		.controller('allincomeStatmentController', allincomeStatmentController);

	// dependency injections.
	allincomeStatmentController.$inject = ['authentication', 'userservice', '$location'];

	function allincomeStatmentController(authentication, userservice, $location) {
		const inStmt = this;

		// when user logged in.
		if(authentication.isLoggedIn()){
			// load all income statements.
			inStmt.loadAllIncomeStatements = function () {
				// calling methods from user service to show incomes.
				userservice
					.showIncome(authentication.currentUser().email)
					.then(function (response) {
							if(response.data.success === true) {
								// we have incomes.
								inStmt.weHaveIncomes = true;
								// checking we have at least one income statement to show
								if(response.data.data.length < 1) {
									inStmt.weHaveNoIncome = true;
								}

								// incomeList
								inStmt.incomesList = response.data.data;
							}
							else if(response.data.error) {
								inStmt.weHaveIncomes = false;
							}
					})
					.catch(function(err){
						alert(err);
					})
			}

			// to delete an income statment.
			inStmt.deleteStatement = function (incomeId) {
				
				// calling method from userservice.
				userservice
					.deleteIncome(authentication.currentUser().email, incomeId)
					.then(function (response) {
						if(response.data.success === true) {
							// calling method to load latest incomes.
							inStmt.loadAllIncomeStatements();
							inStmt.deletingError = false;
						}
						else if(response.data.error) {
							inStmt.deletingError = true;
						}
					})
					.catch(err => {
						alert(err);
					})
			}
		}
		else{
			$location.path('/signin');
		}
	}
})(); 
