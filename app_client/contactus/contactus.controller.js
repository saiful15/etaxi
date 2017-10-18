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
					if (response.data.error) {
						ctvm.messageError = true;
						ctvm.messageErrorMsg = response.data.error;
					}
					else{
						ctvm.messageError = false;
						ctvm.messageErrorMsg = 'We have received your request. We will be in touch soon';
					}
				})
				.catch(err => alert(err));
		}
	}
})();
