
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

// export routes so that we can use it in other part of the application.
module.exports = routes;
