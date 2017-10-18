/*
|----------------------------------------------
| setting up contactus controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('contactusCtrl', contactusCtrl);

	contactusCtrl.$inject = ['systemService'];

	function contactusCtrl (systemService){
		const 	ctvm 		=	this;

		ctvm.message = {
			name: '',
			email: '',
			body: '',
		};

		ctvm.sendMessage = () => {
			systemService
				.contactMessage(ctvm.message)
				.then((response) => {
					console.log(response);
				})
				.catch(err => alert(err));
		}
	}
})();
