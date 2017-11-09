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

	msgController.$inject = ['authentication', '$location', 'userservice', '$route', '$routeParams'];

	function msgController (authentication, $location, userservice, $route, $routeParams) {
		const msgvm = this;

		if (authentication.isLoggedIn()) {
			msgvm.composeOn = false;
			msgvm.singleMessage = false;
			msgvm.inboxOn = true;
			msgvm.turnComposeOn = () => {
				msgvm.composeOn = true;
				msgvm.inboxOn = false;
				msgvm.singleMessage = false;
			}

			msgvm.turnInboxOn = () => {
				msgvm.inboxOn = true;
				msgvm.composeOn = false;
				msgvm.singleMessage = false;
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

			msgvm.viewMessage = (messageId) => {				
				// turn off index view.
				msgvm.inboxOn = false;
				msgvm.singleMessage = true;

				// calling userservice.
				userservice
					.viewSingleMessage(messageId)
					.then((response) => {
						if (response.data.error) {
							msgvm.singleMessageError = true;
							msgvm.singleMessageErrorMessage = response.data.error;
						}
						else {
							msgvm.singleMessageError = false;
							msgvm.singleMessageData = response.data.message;
						}
					})
					.catch((err) => alert(err));
			}

			// to reply to a message.
			msgvm.replyMessage = () => {
				msgvm.replyOn = true;
				msgvm.replyMessage = {
					_id: '',
					reply: '',
					sender: '',
					receiver: '',
				};
				msgvm.sendReply = () => {
					console.log(msgvm.replyMessage);
				}
			}
		}
		else {
			$location.path('/signin');
		}
	}
})();
