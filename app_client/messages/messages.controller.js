/*
|----------------------------------------------
| setting up message controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
'use strict';

(function () {
	angular
		.module('etaxi')
		.controller('msgController', msgController);

	msgController.$inject = ['authentication', '$location', 'userservice', '$route'];

	function msgController (authentication, $location, userservice, $route) {
		const msgvm = this;

		if (authentication.isLoggedIn()) {
			msgvm.composeOn = false;
			msgvm.inboxOn = true;
			msgvm.turnComposeOn = () => {
				msgvm.composeOn = true;
				msgvm.inboxOn = false;
			}

			msgvm.turnComposeOff = () => {
				msgvm.composeOn = false;
				msgvm.inboxOn = true;
			}
			msgvm.createMessage = {
				sender: authentication.currentUser().email,
				receiver: '',
				subject: '',
				message: '',
			};
			msgvm.sendMessage = () => {
				userservice
					.sendMessage(msgvm.createMessage)
					.then((response) => {
						if (response.data.error) {
							msgvm.msgError = true;
							msgvm.msgErrorMessage = response.data.error;
						}
						else if (response.data.success === true) {
							msgvm.msgError = false;
							setTimeout(() => {
								$route.reload();
							}, 1000)
						}
					})
					.catch((err) => alert(err));
			}

			// load inbox
			msgvm.loadInbox = () => {
				userservice
					.viewAllMessage(authentication.currentUser().email)
					.then((response) => {
						if (response.data.error) {
							msgvm.inboxLoadError = true;
							msgvm.inboxLoadErrorMessage = response.data.error;
						}
						else if (response.data.success === true) {
							msgvm.inboxLoadError = false;

							if(response.data.message.length > 0) {
								msgvm.messages = response.data.message;
							}
							else {
								msgvm.emptyInbox = true;
							}
						}
					})	
					.catch((err) => alert(err));
			}
		}
		else {
			$location.path('/signin');
		}
	}
})();
