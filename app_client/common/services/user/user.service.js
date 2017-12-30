/*
|----------------------------------------------
| setting up service for system
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: ncl, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.service('userservice', userservice);

	//dependency 
	userservice.$inject = ['$http'];

	function userservice($http) {

		const showUsers = () => {
			return $http
				.get('/api/users')
				.then(handleSuccess)
				.catch(handleError);
		};
		const searchUser = (query) => {
			return $http
				.get('/api/'+query+'/search')
				.then(handleSuccess)
				.catch(handleError);
		};
		const showUser = (email) => {
			return $http
				.get('/api/'+email+'/user')
				.then(handleSuccess)
				.catch(handleError);
		};

		const getSingleCustomerDetails = (userId) => {
			return $http
				.get('/api/'+userId+'/showuser')
				.then(handleSuccess)
				.catch(handleError);
		};

		// for accountant init.
		const checkAccountantCollection = () => {
			return $http
				.get('/api/checkaccountantcollection')
				.then(handleSuccess)
				.catch(handleError);
		};

		const addAccountant = (accountant) => {
			return $http
				.post('/api/addaccountant', accountant)
				.then(handleSuccess)
				.catch(handleError);
		};

		const createAccountantLogin = (data) => {
			return $http
				.post('/api/createaccountantlogin', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const updateLoginAccountantCreation = (AccountantId) => {
			return $http 
				.put('/api/'+AccountantId+'/updatelogincreation')
				.then(handleSuccess)
				.then(handleError);
		};

		var				getUserStatus 		=		function(email){
			return $http
					.get('/api/userstatus/'+email)
					.then(handleSuccess)
					.catch(handleError);
		};


		var 			updateUserStatus 	=		function(updateData){
			return $http
					.post('/api/userstatus/',updateData)
					.then(handleSuccess)
					.catch(handleError);
		};

		var 			updateAddress		=		function(userId, updatedAddressData){
			return $http	
					.post('/api/updateaddress/'+userId, updatedAddressData)
					.then(handleSuccess)
					.catch(handleError);
		};

		var 			saveProfile 		=		function(email, data){
			return $http
					.post('/api/saveprofile/'+email, data)
					.then(handleSuccess)
					.catch(handleError);
		};

		var 			getProfile 			=		function(email){
			return 	$http
						.get('/api/userprofile/'+email)
						.then(handleSuccess)
						.catch(handleError);
		};

		var 	addAdditionalInformation 	=		function(userId, data){
			return 	$http
						.post('/api/addaditionalinfo/'+userId, data)
						.then(handleSuccess)
						.catch(handleError);
		};

		// add expense for the users.
		var addExpense = function (userId, data) {
			return $http
				.post('/api/addexpense/'+userId, data)
				.then(handleSuccess)
				.catch(handleError);
		};

		// show expens.
		var showExpenseSummary = function (userId) {
			return $http
				.get('/api/showexpense/'+userId)
				.then(handleSuccess)
				.catch(handleError);
		};

		const showExpenseFile = (userId, expenseId) => {
			return $http	
				.get('/api/expense/'+userId+'/'+expenseId)
				.then(handleSuccess)
				.catch(handleError);
		};

		// add income
		var addIncome = function (userId, data) {
			return $http
				.post('/api/'+userId+'/addincome', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const showIncome = function (userId) {
			return $http
				.get('/api/'+userId+'/showincome')
				.then(handleSuccess)
				.catch(handleError);
		};

		const showEstimatedTax = function (userId, totalIncome) {
			return $http
				.get('/api/'+userId+'/'+totalIncome+'/showestimatedtax')
				.then(handleSuccess)
				.catch(handleError);
		};

		const showSingleIncome = function (userId, incomeId) {
			return $http
				.get('/api/'+userId+'/getincome/'+incomeId)
				.then(handleSuccess)
				.catch(handleError);
		};

		const updateIncomeStatement = function (userId, incomeId, data) {
			return $http
				.patch('/api/'+userId+'/updateincome/'+incomeId, data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const deleteIncome = function(userId, incomeId) {
			return $http
				.delete('/api/'+userId+'/'+incomeId+'/deleteincome')
				.then(handleSuccess)
				.catch(handleError);
		};

		// to add personal contact details.
		const addContactDetails = (userId, contact) => {
			return $http
				.post('/api/'+userId+'/addcontact/', contact)
				.then(handleSuccess)
				.catch(handleError);
		};

		// show contact details.
		const showContact = (userId) => {
			return $http 
				.get('/api/showcontact/'+userId)
				.then(handleSuccess)
				.catch(handleError);
		};

		const addBusinessInfo = (userId, data) => {
			return $http
				.post('/api/'+userId+'/addbusinessinfo/', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const showBusinessBasic = (userId) => {
			return $http
				.get('/api/'+userId+'/showbusinessinfo')
				.then(handleSuccess)
				.catch(handleError);
		};

		const addVehicleInfo = (userId, data) => {
			return $http
				.post('/api/'+userId+'/addvehicle', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const showVehicle = (userId) => {
			return $http
				.get('/api/'+userId+'/showvehicle')
				.then(handleSuccess)
				.catch(handleError);
		};

		const addInsurance = (userId, data) => {
			return $http
				.post('/api/'+userId+'/insurance', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const showInsurance = (userId) => {
			return $http
				.get('/api/'+userId+'/insurance')
				.then(handleSuccess)
				.catch(handleError);
		};

		const addLisence = (userId, data) => {
			return $http 
				.post('/api/'+userId+'/lisence', data)
				.then(handleSuccess)
				.catch(handleError);
		};

		const userLisence = (userId) => {
			return $http
				.get('/api/'+userId+'/lisence')
				.then(handleSuccess)
				.catch(handleError);
		};

		const exportToCSV = (user, source)  => {
			return $http 
				.get('/api/'+user+'/'+source)
				.then(handleSuccess)
				.catch(handleError);
		};

		const loadUserContact = (email) => {
			return $http 
				.get('/api/'+email+'/contacts')
				.then(handleSuccess)
				.catch(handleError);
		};

		const adminContact = ()=> {
			return $http
				.get('/api/allcontacts')
				.then(handleSuccess)
				.catch(handleError);
		};

		const sendMessage = (message) => {
			return $http
				.post('/api/message', message)
				.then(handleSuccess)
				.catch(handleError);
		};

		const viewAllMessage = (userId) => {
			return $http
				.get('/api/'+userId+'/messages')
				.then(handleSuccess)
				.catch(handleError);
		};

		const viewAllSentMessage = (userId) => {
			return $http
				.get('/api/'+userId+'/sentmessages')
				.then(handleSuccess)
				.catch(handleError);
		};

		const viewSingleMessage = (messageId) => {
			return $http
				.get('/api/'+messageId)
				.then(handleSuccess)
				.catch(handleError);
		};

		const sendReply = (messageId, replymessage) => {
			return $http 
				.post('/api/'+messageId+'/replymessage', replymessage)
				.then(handleSuccess)
				.catch(handleError);
		};

		const accountantProfile = function (accountantId) {
			return $http 
				.get('/api/accountant/'+accountantId)
				.then(handleSuccess)
				.catch(handleError);
		};

		const createDocument = (data) => {
			return $http
				.post('/api/createdoc', data)
				.then(handleSuccess)
				.catch(handleError);
		}

		const checkDocuments = (userId) => {
			return $http 
				.get('/api/'+userId+'/checkdocs')
				.then(handleSuccess)
				.catch(handleError);
		}
		
		function 	handleSuccess(response){
			return response;
		};

		function 	handleError(response){
			return response;
		};

		return {
			showUsers: showUsers,
			searchUser: searchUser,
			showUser: showUser,
			checkAccountantCollection: checkAccountantCollection,
			updateLoginAccountantCreation: updateLoginAccountantCreation,
			addAccountant: addAccountant,
			createAccountantLogin: createAccountantLogin,
			getUserStatus: getUserStatus,
			saveProfile: saveProfile,
			updateUserStatus: updateUserStatus,
			getProfile: getProfile,
			updateAddress: updateAddress,
			addExpense: addExpense,
			showExpenseSummary: showExpenseSummary,
			addIncome: addIncome,
			showIncome: showIncome,
			showEstimatedTax: showEstimatedTax,
			deleteIncome: deleteIncome,
			showSingleIncome: showSingleIncome,
			updateIncomeStatement: updateIncomeStatement,
			addAdditionalInformation: addAdditionalInformation,
			addContactDetails: addContactDetails,
			showContact: showContact,
			addBusinessInfo: addBusinessInfo,
			showBusinessBasic: showBusinessBasic,
			addVehicleInfo: addVehicleInfo,
			showVehicle: showVehicle,
			addInsurance: addInsurance,
			showInsurance: showInsurance,
			addLisence: addLisence,
			userLisence: userLisence,
			exportToCSV: exportToCSV,
			loadUserContact: loadUserContact,
			adminContact: adminContact,
			sendMessage: sendMessage,
			viewAllMessage: viewAllMessage,
			viewSingleMessage: viewSingleMessage,
			sendReply: sendReply,
			viewAllSentMessage: viewAllSentMessage,
			showExpenseFile: showExpenseFile,
			accountantProfile: accountantProfile,
			getSingleCustomerDetails: getSingleCustomerDetails,
			createDocument: createDocument,
			checkDocuments: checkDocuments
		};
	}
})();
