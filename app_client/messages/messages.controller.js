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
			msgvm.sentboxOn = false;

			if (authentication.currentUser().account_type === 'admin'){
				msgvm.loadAdminContactList = true;
			}
			else {
				msgvm.loadAdminContactList = false
			}

			// load contact for the user.
			msgvm.loadContact = () => {
				userservice
					.loadUserContact(authentication.currentUser().email)
					.then((response) => {
						if (response.data.success) {
							msgvm.contacts = response.data.contacts[0].appContact.filter((contact) => {
								return contact.contactEmail !== 'taxiadmin@taxiaccounting.co.uk';
							})
						}
					})
					.catch((err) => {
						alert(err);
					})
			}

			msgvm.turnComposeOn = () => {
				msgvm.composeOn = true;
				msgvm.sentboxOn = false;
				msgvm.inboxOn = false;
				msgvm.singleMessage = false;
			}

			msgvm.turnSentOn = () => {
				msgvm.sentboxOn = true;
				msgvm.composeOn = false;
				msgvm.inboxOn = false;
				msgvm.singleMessage = false;
			}

			msgvm.turnInboxOn = () => {
				msgvm.inboxOn = true;
				msgvm.sentboxOn = false;
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

			// sent box.
			msgvm.loadSentBox = () => {
				userservice
					.viewAllSentMessage(authentication.currentUser().email)
					.then((response) => {
						if (response.data.error) {
							msgvm.sentboxLoadError = true;
							msgvm.sentBoxLoadErrorMessage = response.data.error;
						}
						else if (response.data.success === true) {
							msgvm.sentboxLoadError = false;

							if(response.data.message.length > 0) {
								msgvm.sentMessages = response.data.message;
							}
							else {
								msgvm.emptySentBox = true;
							}
						}
					})
					.catch((err) => alert(err));
			}

			msgvm.viewMessage = (messageId) => {				
				// turn off index view.
				msgvm.inboxOn = false;
				msgvm.sentboxOn = false;
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
							console.log(response);
							msgvm.singleMessageError = false;
							msgvm.singleMessageData = response.data.message;
						}
					})
					.catch((err) => alert(err));
			}

			// to reply to a message.
			msgvm.replyMessage = (id, sender, receiver) => {
				msgvm.replyOn = true;
				msgvm.replyMessage = {
					reply: '',
					sender: receiver,
					receiver: sender,
				};
				msgvm.sendReply = () => {
					userservice
						.sendReply(id, msgvm.replyMessage)
						.then((response) => {
							if (response.data.error) {
								msgvm.replyError = true;
								msgvm.replyErrorMsg = response.data.error;
							}
							else if (response.data.success) {
								msgvm.replyError = false;	
							}
						})
						.catch((err) => {
							alert(err);
						})
				}
			}
		}
		else {
			$location.path('/signin');
		}
	}
})();
