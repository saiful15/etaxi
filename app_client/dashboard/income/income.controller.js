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
	incomeCtrl.$inject = ['authentication', 'userservice'];

	function incomeCtrl (authentication, userservice) {
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
					}
				})
				.catch(err => function(){
					alert(err);
				})
		}
	}
})();
