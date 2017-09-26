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
	allincomeStatmentController.$inject = ['authentication', 'userservice', '$location', '$filter'];

	function allincomeStatmentController(authentication, userservice, $location, $filter) {
		const inStmt = this;

		// when user logged in.
		if(authentication.isLoggedIn()){
			inStmt.showIncomeList = true;
			inStmt.showEditArea = false;
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

								let totalIncome = 0;
								for(var i =0; i < inStmt.incomesList.length; i++){
									totalIncome += parseFloat(inStmt.incomesList[i].income);
								}
								inStmt.totalIncomes = totalIncome;
							}
							else if(response.data.error) {
								inStmt.weHaveIncomes = false;
							}
					})
					.catch(function(err){
						alert(err);
					})
			}


			// function to edit income statment based on id.
			inStmt.editIncome 	=	function (incomeId) {
				// show the eid form div.
				inStmt.showEditArea = true;
				// hide show income list
				inStmt.showIncomeList = false;

				// calling method from userservice to load data for given income id
				userservice
					.showSingleIncome(authentication.currentUser().email, incomeId)
					.then(response => {
						if(response.data.error) {
							inStmt.editDataLoadError = true;
							inStmt.editDataLoadErrorMessage = response.data.error;
						}
						else if(response.data.success === true) {
							inStmt.editDataLoadError = false;
							// load initial data for given income id.							
							inStmt.incomeEdit = {
								incomeDate: $filter('date')(response.data.data.incomeDate, "yyyy-MM-dd"),
								amount: response.data.data.income,
								income_source: response.data.data.incomeType,
							};
						}
					})
					.catch(err => {
						alert(err);
					})

				// submit edit form
				inStmt.saveEditIncome = function() {
					// checking form validation
					if(!inStmt.incomeEdit.incomeDate || !inStmt.incomeEdit.amount || !inStmt.incomeEdit.income_source) {
						inStmt.editFormValidationError = true;
						inStmt.editFormValidationErrorMessage = 'All fields are requied. Must not be empty';
					}
					else{
						inStmt.editFormValidationError = false;
						// calling method from userservice.
						userservice
							.updateIncomeStatement(authentication.currentUser().email, incomeId, inStmt.incomeEdit)
							.then(response => {
								if(response.data.success === true) {
									// show the eid form div.
									inStmt.showEditArea = false;
									// hide show income list
									inStmt.showIncomeList = true;
								}
								else if(response.data.error) {
									inStmt.editFormValidationError = true;
									inStmt.editFormValidationErrorMessage = response.data.data.error;
								}
							})
							.catch(err => {
								alert(err);
							})
					}
				}
			}

			inStmt.cancelEdit = function() {
				// show the eid form div.
				inStmt.showEditArea = false;
				// hide show income list
				inStmt.showIncomeList = true;
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
