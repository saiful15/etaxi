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
					}
				})
				.catch(err => function(){
					alert(err);
				})
		}
	}
})();
