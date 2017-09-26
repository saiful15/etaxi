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

routes.post('/register', authentication.register);
routes.post('/login', authentication.login);

// route to get user status.
routes.get('/userstatus/:email', userController.getStatusCollection);
routes.get('/userprofile/:email', userController.getUserProfile);
routes.post('/userstatus', userController.updateStatus);

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

// add income 
routes.post('/:userId/addincome', userController.addIncome);

// show income
routes.get('/:userId/showincome', userController.showIncome);

// delete income based on userid and income id.
routes.delete('/:userId/:incomeId/deleteincome', userController.deleteIncome);

// export routes so that we can use it in other part of the application.
module.exports = routes;
