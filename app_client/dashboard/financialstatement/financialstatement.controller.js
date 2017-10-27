/*
|----------------------------------------------
| setting up financial statement controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function () {
	angular
		.module('etaxi')
		.controller('financeCtrl', financeCtrl);
	financeCtrl.$inject = ['authentication', 'userservice'];

	function financeCtrl(authentication, userservice) {

		const fstvm = this;

		fstvm.loadIncome = () => {
			fstvm.totalIncome = 0;
			userservice
				.showIncome(authentication.currentUser().email)
				.then(function(response) {
					if(response.data.success === true) {
						fstvm.incomeList = response.data.data;
						for(var i =0; i < fstvm.incomeList.length; i++) {
							fstvm.totalIncome += parseFloat(fstvm.incomeList[i].income);
						}	
						const cash = fstvm.incomeList.filter((income) => {
							return income.incomeType === 'cash';
						});
						fstvm.totalCash = cash.reduce((sum, singlecash) => {
							return sum + singlecash.income;
						}, 0);

						const card = fstvm.incomeList.filter((income) => {
							return income.incomeType === 'card';
						});

						fstvm.totalCard = card.reduce((sum, singlecard) => {
							return sum + singlecard.income;
						}, 0);

						const accountIncomes = fstvm.incomeList.filter((accountIncome) => {
							return accountIncome.incomeType === 'account';
						});

						fstvm.totalAccountIncome = accountIncomes.reduce((sum, accountIncome) => {
							return sum + accountIncome.income;
						}, 0);
					}
				})
				.catch(err => function(){
					alert(err);
				})
		}

		fstvm.loadExpense = () => {
			fstvm.totalExpense = 0;
			userservice
				.showExpenseSummary(authentication.currentUser().email)
				.then(function(response){
					if(response.data.success === true){
						fstvm.expensesList = response.data.expense;
						for(var i =0; i < fstvm.expensesList.length; i++) {
							fstvm.totalExpense += parseFloat(fstvm.expensesList[i].amount);
						}

						const expensesOil = fstvm.expensesList.filter((expense) => {
							return expense.expense_sector === 'oil';
						});
						
						fstvm.oilExpense = expensesOil.reduce((sum, expense) => {
							return sum + expense.amount;
						}, 0);

						const fuelCosts = fstvm.expensesList.filter((fuel) => {
							return fuel.expense_sector === 'fuel';
						});

						fstvm.fuelTotalCost = fuelCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const roadTax = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'road_tax';
						});

						fstvm.roadTax = roadTax.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const insurances = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'insurance';
						});

						fstvm.insuranceCost = insurances.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const repairCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'repair';
						});

						fstvm.repairCost = repairCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const carRentCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'car_rent';
						});

						fstvm.carRentCost = carRentCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const carFinanceCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'car_finance';
						});

						fstvm.carFinanceCost = carFinanceCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const carWashCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'car_wash';
						});

						fstvm.carWashCost = carWashCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const motCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'mot';
						});

						fstvm.motCost = motCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const tyresCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'tyres';
						});

						fstvm.tyresCost = tyresCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const phoneCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'phone';
						});

						fstvm.phoneCost = phoneCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const accountancyCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'accountancy';
						});

						fstvm.accountancyCost = accountancyCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

						const otherCosts = fstvm.expensesList.filter((cost) => {
							return cost.expense_sector === 'other';
						});

						fstvm.otherCost = otherCosts.reduce((sum, cost) => {
							return sum + cost.amount;
						}, 0);

					}
				})
				.catch(function(err){
					alert(err);
				})
		}

		/*
		|----------------------------------------------
		| Following method will export data from db to csv
		| @author: jahid haque <jahid.haque@yahoo.com>
		| @copyright: comany name, 2017
		|----------------------------------------------
		*/
		fstvm.exportAsCSV = (source) => {
			userservice
				.exportToCSV(authentication.currentUser().email, source)
				.then((response) => {
					console.log(response);
				})
				.catch((err) => alert(err));
		}
	}
})();
