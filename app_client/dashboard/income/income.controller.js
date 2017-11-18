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
	incomeCtrl.$inject = ['authentication', 'userservice', '$scope'];

	function incomeCtrl (authentication, userservice, $scope) {
		const 	invm 		=	this;
		// income object.
		invm.Income = {
			amount: '',
			incomeDate: '',
			income_source: ''
		};
		invm.addIncome = function () {
			if (!invm.Income.amount || !invm.Income.income_source) {
				invm.incomeError = true;
				invm.incomeErrorMsg = "All * fields are required";
			}
			else{
				invm.incomeError = false;

				// calling method from user service service.
				userservice
				 .addIncome(authentication.currentUser().email, invm.Income)
				 .then(function(response) {
				 	if(response.data.success === true) {
				 		invm.incomeError = false;
				 		invm.incomeSuccess = true;
				 		invm.successMgs = `£ ${invm.Income.amount} Successfully added`;
				 		// calling show total income summary.
				 		invm.showIncome();
				 	}
				 })
				 .catch(err => {
				 	alert(err);
				 })

			}
		}

		// show income
		invm.showIncome = function () {
			invm.initialError = true;
			invm.totalIncome = 0;
			let incomeLists;
			// calling method from useservice
			userservice
				.showIncome(authentication.currentUser().email)
				.then(function(response) {
					if(response.data.success === true) {
						invm.initialError = false;
						invm.showTotalIncome = true;
						invm.incomeList = response.data.data;
						for(var i =0; i < invm.incomeList.length; i++) {
							invm.totalIncome += parseFloat(invm.incomeList[i].income);
						}
						// now sorting out last 7 days income.
						var last7Days = Last7Days();

						let weeklyIncomes = last7Days.map(function(x){
							return invm.incomeList.filter(function(income){
								return income.incomeDate === x;
							});
						});

						invm.weeklyIncome = weeklyIncomes.filter(function(income){
							return income.length > 0;
						});	


						let weeklyAmount = invm.weeklyIncome.map((week) => {
							return week.map((day) => {
								return day.income;
							});							
						});
						
						const chartd = weeklyAmount.map((amount) => {
							return amount[0];
						});

						const weeklyTotal = weeklyAmount.map((incomes) => {
							return incomes.reduce((sum, val) => {
								return sum + val;
							}, 0);
						});

						invm.sevendaysIncome = 	weeklyTotal.reduce((sum, value) => {
							return sum + value;
						}, 0);

						$scope.colors = [
			            {
			              backgroundColor: "rgba(159,204,0, 0.2)",
			              pointBackgroundColor: "rgba(159,204,0, 1)",
			              pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
			              borderColor: "rgba(159,204,0, 1)",
			              pointBorderColor: '#fff',
			              pointHoverBorderColor: "rgba(159,204,0, 1)"
			            },"rgba(250,109,33,0.5)","#9a9a9a","rgb(233,177,69)"
			          ];
			         $scope.labels = last7Days;
			         $scope.data = chartd;

					}
				})
				.catch(err => function(){
					alert(err);
				})
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
})();
