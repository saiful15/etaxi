
/*
|----------------------------------------------
| setting up back-end routes
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
var 		express 		=		require('express'),
			routes 			=		express.Router();


// controllers for back-end routes.
var 		authentication 	=		require("../controllers/authentication");
var 		userController	=		require("../controllers/userController");
var 		systemController = require('../controllers/systemController');
const 	messageController = require('../controllers/message.controller');
const 	adminController = require('../controllers/adminController');
const AccountantController = require('../controllers/accountantController');

routes.post('/register', authentication.register);
routes.post('/login', authentication.login);
routes.post('/:email/:id/passwordresetlink', authentication.generateLink);
// routes.get('/:user/:key/:hash', authentication.varifyKey);
routes.put('/:user/:newpassword/:repeatpassword', authentication.updatePassword);

/*
|----------------------------------------------
| following routes for admin operation
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
routes.get('/users', userController.countUser);
routes.get('/allcontacts', adminController.getAllContact);
routes.get('/:query/search', userController.searchUser);
routes.get('/checkaccountantcollection', userController.checkAccountantCollection);
routes.post('/addaccountant', userController.createAccountant);
routes.get('/accountant/:accountantId', userController.getAccountantProfile);
routes.post('/createaccountantlogin', userController.CreateAccountantLogin);
routes.put('/:accountantId/updatelogincreation', userController.UpdateLoginCreation);
routes.get('/:userId/showuser', userController.getSingleUserDetails);
routes.get('/accountants', adminController.showAccountants);
routes.post('/:userId/:accountantId/assignaccountant', adminController.assignAccountant);
// end of admin routes.

/*
|----------------------------------------------
| Following routes for accountants
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
routes.get('/:email/customers', AccountantController.getCustomers);
routes.get('/:email/profile', AccountantController.getProfile);
routes.post('/editcontact', AccountantController.editAccountantBasicContact);
routes.post('/editcompany', AccountantController.editAccountantCompanyInfo);
routes.get('/:userId/custmer', AccountantController.getCustomerInfo);
//end of of accountant routes.

// file upload routes.
routes.post('/fileupload/:documentId/:userId', systemController.uploadFile);

// document upload for the accountant.
routes.post('/docupload/:documentId/:userId', systemController.documentUpload);
routes.post('/createdoc', systemController.insertDocumentInfo);
routes.get('/:userId/checkdocs', systemController.checkDocs);

// route for contact page.
routes.post('/contact', systemController.sendMessage);

// route to get user status.
routes.get('/:email/user', userController.showUser);

routes.get('/userprofile/:email', userController.getUserProfile);
routes.post('/userstatus', userController.updateStatus);
routes.get('/userstatus/:email', userController.getStatusCollection);

// create user profile collection.
routes.post('/saveprofile/:email', userController.createProfile);

// add additioninfo
routes.post('/addaditionalinfo/:userId', userController.saveAdditionInfo);

// update address
routes.post('/updateaddress/:userId', userController.updateAddress);

// add expense
routes.post('/addexpense/:userId', userController.addExpenses);

// show expenses.
routes.get('/showexpense/:userId', userController.showExpense);
routes.get('/:userId/showestimatedtax', userController.calculateEstimatedTax);
routes.get('/expense/:userId/:expenseId', userController.sendExpenseFile);

// add income 
routes.post('/:userId/addincome', userController.addIncome);

// show incomes for given user id.
routes.get('/:userId/showincome', userController.showIncome);

// show single income for given user id and income id
routes.get('/:userId/getincome/:incomeId', userController.showSingleIncome);

// delete income based on userid and income id.
routes.delete('/:userId/:incomeId/deleteincome', userController.deleteIncome);

// update a single income based on id.
routes.patch('/:userId/updateincome/:incomeId', userController.updateIncome);

// route to add personal contact details.
routes.post('/:userId/addcontact/', userController.addContact);
// show contact details.
routes.get('/showcontact/:userId', userController.showContact);

//add business type and name
routes.post('/:userId/addbusinessinfo/', userController.addBusinessInfo);
// show business type and name.
routes.get('/:userId/showbusinessinfo', userController.showBusinessInfo);
// add vehicle information.
routes.post('/:userId/addvehicle', userController.addVehicle);
// show vechile.
routes.get('/:userId/showvehicle', userController.showVehicle);

// add insurance details.
routes.post('/:userId/insurance', userController.addInsurance);
// to show insurance detials
routes.get('/:userId/insurance', userController.showInsurance);

// save lisence information.
routes.post('/:userId/lisence', userController.addLisence);

// show user lisence information.
routes.get('/:userId/lisence', userController.showLisence);

/*
|----------------------------------------------
| Following routes are for message
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccountant, 2017
|----------------------------------------------
*/
routes.get('/:email/contacts', messageController.loadContacts);
routes.post('/message', messageController.sendMessage);
routes.get('/:userid/messages', messageController.viewMessages);
routes.get('/:messageId', messageController.viewMessage);
routes.get('/:userId/sentmessages', messageController.viewSent);
routes.post('/:messageId/replymessage', messageController.replyMessage);
// export routes so that we can use it in other part of the application.
module.exports = routes;
