require('dotenv').config({});
/*
|----------------------------------------------
| setting up user controller 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
var 		mongoose 		=		require('mongoose'),
			Joi 				=		require('joi'),
			fs 				=		require('fs'),
			uId 				=		require('uid'),
			json2csv 		=  	require('json2csv'),
			users 			=		mongoose.model('users'),
			contacts 		=		mongoose.model('contacts'),
			expenses 		=		mongoose.model('expenses'),
			accoutants 		=		mongoose.model('accountant'),
			vehicles 		=		mongoose.model('vehicles'),
			incomes 			=		mongoose.model('incomes');

const Business = mongoose.model('business');
const Insurance = mongoose.model('insurance');
const Lisence = mongoose.model('lisence')
const AdditionalInfo = mongoose.model('additionalinfo');

const Mailer = require('../config/nodemailer');


var 		sendJsonResponse 	=	function(res, status, content){
	res.status(status);
	res.json(content);
}

const userId = Joi.object().keys({
	userId: Joi.string().email().min(3).required(),
});

/*
|----------------------------------------------
| count user controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.countUser = (req, res) => {
	users
		.find()
		.count((err, count) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
				return;
			}
			else {
				sendJsonResponse(res, 200, {
					success: true,
					count: count,
				});
			}
		})
}


/*
|----------------------------------------------
| Following function will search the user collection
| based on given useremail
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.searchUser = (req, res) => {
	const searchQuery = Joi.object().keys({
		query: Joi.string().required(),
	});

	Joi.validate(req.params, searchQuery, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			users
				.find({email: req.params.query})
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!user) {
						sendJsonResponse(res, 404, {
							error: `Error! while searching for user. Contact admin`,
						});
						return;
					}
					else if (user.length === 0) {
						sendJsonResponse(res, 404, {
							error: `No user has been found with ${req.params.query}`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							results: user,
						});
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following function will check accoutant collection
| exists or not.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccountant, 2017
|----------------------------------------------
*/
module.exports.checkAccountantCollection = (req, res) => {
	accoutants
		.find()
		.exec((err, accountant) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				})
				return;
			}
			else {
				sendJsonResponse(res, 200, {
					success: true,
					accountant: accountant,
				});
			}
		})
}

/*
|----------------------------------------------
| Following function will add accountat to the 
| system
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.createAccountant = (req, res) => {
	const accountantProfile = Joi.object().keys ({
		name: Joi.string().regex(/^[a-zA-Z ]{3,20}$/).required(),
		email: Joi.string().email().required(),
		mobile: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/).required(),
	});

	const accountantCompany = Joi.object().keys({
		company_name: Joi.string().regex(/^[a-zA-Z0-9 ]{5,50}$/).required(),
		address: Joi.string().required(),
		tel: Joi.string().regex(/^[0-9]{11,11}$/).allow(''),
		company_email: Joi.string().email().allow(''),
		website: Joi.string().uri().allow(''),
	});
	
	Joi.validate(req.body.profile, accountantProfile, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			// now validate company information.
			Joi.validate(req.body.company, accountantCompany, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err.details[0].message,
					});
					return;
				}
				else {
					accoutants.create({
						name: req.body.profile.name,
						email: req.body.profile.email,
						mobile: req.body.profile.mobile,
						company: [{
							name: req.body.company.company_name,
							address: req.body.company.address,
							email: req.body.company.company_email,
							tel: req.body.company.tel,
							website: req.body.company.website,
						}]
					}, (err, accountant) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: `Error while adding accountant\t: ${err}`,
							});
							return;
						}
						else {
							sendJsonResponse(res, 200, {
								success: true,
								accountant: accountant,
							});
						}
					})
				}
			})
		}
	})
}

/*
|----------------------------------------------
| Following function will get accountant profile
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.getAccountantProfile = (req, res) => {
	const accountantId = Joi.object().keys({
		accountantId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
	});

	Joi.validate(req.params, accountantId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			accoutants
				.findOne({_id: req.params.accountantId})
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!accountant) {
						sendJsonResponse(res, 404, {
							error: `No accountant has been found with ${req.params.accountantId} id`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							accountant: accountant,
						});
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following function will create accountant login
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.CreateAccountantLogin = (req, res) => {
	const accountantInfo = Joi.object().keys({
		email: Joi.string().email().required(),
		account_type: Joi.string().min(10).max(10).regex(/^[a-z]{10,10}$/).required(),
	});

	Joi.validate(req.body, accountantInfo, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			// create new users object.
			const accountant = new users();
			const userId = uId(10);
			const userPassword = uId(8);
			const userDir = './users/'+userId;
			accountant.email = req.body.email;
			accountant.userId = userId;
			accountant.userDir = userDir;
			accountant.password = accountant.setPassword(userPassword);
			accountant.status   =	"premium";
			accountant.account_type = req.body.account_type;
			accountant.statusCollection = {};
			accountant.appContact = {};

			// now saving accountant.
			accountant.save((err) => {
				if (err) {
					if(err.code == '11000'){
						sendJsonResponse(res, 400, {
							error: "This email address has been taken."
						});
					}
					else{
						sendJsonResponse(res, 400, {
							error: "System Error! Please contact admin"
						});	
					}
					return false;
				}
				else {
					if (!fs.mkdirSync(userDir)) {
						// now send email to accountant.
						const message = {
							form: process.env.mailuser,
							to: req.body.email,
							subject: `TaxiAccounting - Accountant login details`,
							html: `<p>Taxi accounting admin has created an accountant profile for you.
							Your username is ${req.body.email} and password is <pre>${userPassword} </pre>. 
							Please also check your junk inbox for this email.Please visit following link to log 
							into your account.<br/> <a href='http://www.taxiaccounting.co.uk/signin' target='_blank'>Login</a></p>`,
						};

						// verifing connection.
						Mailer.verify((err, success) => {
							if (err) {
								sendJsonResponse(res, 400, {
									error: 'Error! while connecting with mail server',
								});
								return;
							}
							else {
								Mailer.sendMail(message, (err, info) => {
									if (err) {
										sendJsonResponse(res, 400, {
											error: `Error! while emailing account details ${err}`,
										});
										return;
									}
									else{
										sendJsonResponse(res, 200, {
											success: true,
										});
									}
								});
							}
						});

					}
					else {
						sendJsonResponse(res, 400, {
							error: "System Error! while creating user directory. Please contact admin"
						});
					}
				}
			})
		}
	})
}

/*
|----------------------------------------------
| Following function will update the accountant's
| login account creation status on accountant 
| schema.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.UpdateLoginCreation = (req, res) => {
	const accountantId = Joi.object().keys({
		accountantId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
	});

	Joi.validate(req.params, accountantId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			accoutants
				.findById(req.params.accountantId)
				.exec((err, accountant) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!accountant) {
						sendJsonResponse(res, 404, {
							error: `Error! No Accountant has been found`,
						});
						return;
					}
					else {
						accountant.accountCreated = true;
						// saving the change.
						accountant.save((err) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: `Error! while saving accountant info. Please contact admin`,
								});
								return;
							}
							else {
								sendJsonResponse(res, 200, {
									success: true,
								});
							}
						})
					}
				})
		}
	});
}

/*
|----------------------------------------------
| Following method will get details for a single
| user
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.getSingleUserDetails = (req, res) => {
	const UserId = Joi.object().keys({
		userId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/)
	});

	Joi.validate(req.params, UserId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			users
				.findById(req.params.userId)
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							user: user,
						});
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following function get all status collection.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.getStatusCollection 		=		function(req, res){
	if(!req.params && !req.params.email){
		sendJsonResponse(res, 404, {
			message: "Invalid request"
		});
	}
	else{
		// calling users model and run the query.
		users
			.findOne({email: req.params.email})
			.select('statusCollection')
			.exec(function(err, statusCollection){
				if(!statusCollection){
					sendJsonResponse(res, 404, {
						error: 'No status collections found with this email address.'
					});
				}
				else if(err){
					sendJsonResponse(res, 404, {
						error: err
					});
				}
				else{					
					sendJsonResponse(res, 200, {
						status: statusCollection
					});
				}
			})
	}
}

/*
|----------------------------------------------
| Following method will get the user object
| from the database
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showUser = (req, res) => {
	if (!req.params && !req.params.email) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request. email address is required',
		});
	}
	else {
		const email = Joi.object().keys({
			email: Joi.string().email().min(3).required(),
		});
		Joi.validate(req.params, email, (err, value) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
				return;
			}
			else {
				users
					.findOne({email: req.params.email})
					.exec((err, user) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
							return;
						}
						else if (!user) {
							sendJsonResponse(res, 404, {
								error: `No user found with ${req.params.email}`,
							});
							return;						
						}
						else{
							sendJsonResponse(res, 200, {
								user: user,
							});
						}
					})
			}
		})
	}
}

/*
|----------------------------------------------
| Following function will create user personal 
| profile
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.createProfile 			=		function(req, res){
	if(!req.params && !req.params.email){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else{
		if(!req.body.first_name || !req.body.last_name || !req.body.house_no || !req.body.street_name
			|| !req.body.city_name || !req.body.county || !req.body.postcode){
			sendJsonResponse(res, 404, {
				error: "All fields are required. Must not be empty"
			});
			return false;
		}
		else{
			users
				.findOne({email: req.params.email})
				.select('profile')
				.exec(function(err, user){
					if(err){
						sendJsonResponse(res, 404, {
							error: err
						});
					}
					else if(!user){
						sendJsonResponse(res, 404, {
							error: "no user found with this email address"
						});
					}
					else{
						var 	address 	={
							house_number: req.body.house_no,
							street_name: req.body.street_name,
							postcode: req.body.postcode,
							city_name: req.body.city_name,
							county: req.body.county
						};
						user.profile.push({
							created_at: Date.now(),
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							address: address
						});
						// saving the profile
						user.save(function(err, user){
							if(err){
								sendJsonResponse(res, 404, {
									error: err
								});
							}
							else{
								sendJsonResponse(res, 200, {
									profile: user.profile
								});
							}
						})

					}
				})
		}
	}
}


/*
|----------------------------------------------
| following function will update the user status
| according to given user.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.updateStatus 		=		function(req, res){
	if(!req.body.email || !req.body.status || !req.body.update_at){
		sendJsonResponse(res, 404, {
			error: "Invalid request."
		});
	}
	else{
		// find user according to email address.
		users
			.findOne({email: req.body.email})
			.select('statusCollection')
			.exec(function(err, user){
				if(err){
					sendJsonResponse(res, 404, {
						error: err
					});
				}
				else if(!user){
					sendJsonResponse(res, 404, {
						error: "user not found with given email address"
					});
					return;
				}
				else{
					if(user.statusCollection && user.statusCollection.length > 0){
						var newStatus 	=	user.statusCollection[0];
						newStatus[req.body.update_at] = req.body.status;												
						// now save the change.
						user.save(function(err, user){
							if(err){
								sendJsonResponse(res, 404, {
									error: err
								});
								return;
							}
							else{
								sendJsonResponse(res, 200, {
									updated: true
								});
							}
						})
					}
				}
			})
	}
}

/*
|----------------------------------------------
| Following function will get user profile 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
module.exports.getUserProfile 		=		function(req, res){
	if(!req.params && !req.params.email){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else{
		// now calling users mongoose model to query.
		users
			.findOne({email: req.params.email})
			.select('profile')
			.exec(function(err, user){
				if(!user){
					sendJsonResponse(res, 404, {
						error: "No user found for this email address"
					});
				}
				else if(err){
					sendJsonResponse(res, 404, {
						error: err
					});
				}
				else{
					sendJsonResponse(res, 200, {
						success: true,
						profile: user
					});
				}
			})
	}
}


/*
|----------------------------------------------
| following function will update user person address
| based on given id.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.updateAddress 		=		function(req, res){
	if(!req.params && !req.params.userId){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else {
		if(!req.body.house_number || !req.body.street_name || !req.body.post_code || !req.body.city ||
			!req.body.county) {
			sendJsonResponse(res, 404, {
				error: "All fields required. Must not be empty"
			});
		}
		else{
			// find user with given id.
			users
				.findById({"_id": req.params.userId})
				.select('profile')
				.exec(function(err, user){
					var newAddress;
					if(err){
						sendJsonResponse(res, 404, {
							error: err
						});
						return;
					}
					else if(!user){
						sendJsonResponse(res, 404, {
							error: "user not found with given id"
						});
						return;
					}
					else{
						// finding subdocuments.
						if(user.profile && user.profile.length > 0){
							newAddress = user.profile[0].address;
							// adding new address.
							newAddress[0].county = req.body.county;
							newAddress[0].city_name = req.body.city;
							newAddress[0].postcode = req.body.post_code;
							newAddress[0].street_name = req.body.street_name;
							newAddress[0].house_number = req.body.house_number;
							// now save these new address.
							user.save(function(err, user){
								if(err){
									sendJsonResponse(res, 404, {
										error: err
									});
									return;
								}
								else {
									sendJsonResponse(res, 200, {
										success: newAddress
									});
								}
							})
						}
						else{
							sendJsonResponse(res, 404, {
								error: "no address found"
							});
							return;
						}
					}
				})
		}
	}
}


/*
|----------------------------------------------
| Following function will add additional info
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
module.exports.saveAdditionInfo = (req, res) => {
	const userId = Joi.object().keys({
		userId: Joi.string().email().required(),
	});

	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
		}
		else {
			const additionaInfo = Joi.object().keys({
				ni_number: Joi.string().required(),
				uti_number: Joi.string().required(),
			});

			Joi.validate(req.body, additionaInfo, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err.details[0].message,
					});
				}
				else {
					const additionalinfo = new AdditionalInfo();

					additionalinfo.infoId = uId(10);
					additionalinfo.whos = req.params.userId;
					additionalinfo.ni_number = req.body.ni_number;
					additionalinfo.uti_number = req.body.uti_number;

					additionalinfo.save(err => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
						}
						else {
							sendJsonResponse(res, 200, {
								updated: true,
							});
						}
					})
				}
			});
		}
	});
}

/*
|----------------------------------------------
| Following function will add expense to the user
| collection.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addExpenses = function (req, res) {
	if (!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request'
		});
	}
	else{
		const expense = new expenses();
		expense.expenseId = uId(10);
		expense.whos = req.params.userId;
		expense.startDate = req.body.date;
		expense.documentId = req.body.documentId;
		expense.documentDir = req.body.documentDir;
		expense.expense_sector = req.body.expense_sector;
		expense.amount = req.body.amount;

		expense.save((err) => {
			if(err) {
				sendJsonResponse(res, 404, {
					error: err
				});
				return;
			}
			else {
				sendJsonResponse(res, 200, {
					success: true
				});
			}
		});
	}
}


/*
|----------------------------------------------
| show expense.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showExpense = function (req, res) {
	if (!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request'
		});
	}
	else{
		// get user expense object.
		expenses
			.find({whos: req.params.userId})
			.exec(function(err, expenses){
				if(!expenses) {
					sendJsonResponse(res, 404, {
						error: "No expenses found with given user id"
					});
					return;
				}
				if(err) {
					sendJsonResponse(res, 404, {
						error: err
					});
					return;
				}
				else{
					sendJsonResponse(res, 200, {
						success: true,
						expense: expenses
					});
				}
			})
	}
}


/*
|----------------------------------------------
| Following function will show single expense
| based on given user id and expense id
|----------------------------------------------
*/
module.exports.showSingleExpense = (req, res) => {
	const expenseInfo = Joi.object().keys({
		userId: Joi.string().email().required(),
		expenseId: Joi.string().min(24).max(24).required(),
	});

	Joi.validate(req.params, expenseInfo, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
		}
		else {
			expenses
				.find({whos: req.params.userId, _id: req.params.expenseId})
				.exec((err, expense) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
					}
					else if (!expense) {
						sendJsonResponse(res, 404, {
							error: 'no expense found for given details',
						});
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							data: expense,
						});
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following function will get the expense file
| and send it
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.sendExpenseFile = (req, res) => {
	expenses
		.findOne({whos: req.params.userId, expenseId: req.params.expenseId})
		.exec((err, expense) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
				return;
			}
			else {
				const expenseFile = expense.documentDir;
				res.download(expenseFile);
			}
		})
}

/*
|----------------------------------------------
| Following function will income to user collection
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.addIncome = function (req,res) {
	if(!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else {
		var income = new incomes();
		var incomeId = uId(10);
		income.incomeId = incomeId;
		income.whos = req.params.userId;
		income.incomeDate = req.body.incomeDate;
		income.income = req.body.amount;
		income.incomeType = req.body.income_source;
		
		income.save(function(err){
			if(err) {
	 			sendJsonResponse(res, 404, {
	 				error: err,
	 			});
	 			return;
	 		}
	 		else {
	 			sendJsonResponse(res, 200, {
 					success: true,
 					data: income
 				});
	 		}
		});
	}
}

/*
|----------------------------------------------
| Following function will show income for user
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showIncome = function (req, res) {
	if(!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else {
		incomes
		 	.find({whos: req.params.userId})
		 	.exec(function (err, incomes) {
		 		if(err) {
		 			sendJsonResponse(res, 404, {
		 				error: err,
		 			});
		 			return;
		 		}
		 		if (!incomes) {
		 			sendJsonResponse(res, 404, {
		 				error: 'no income found with given user id',
		 			});
		 			return;
		 		}
		 		else {
		 			sendJsonResponse(res, 200, {
		 				success: true,
		 				data: incomes
		 			});
		 		}
		 	})
	}
}

/*
|----------------------------------------------
| Following function will calculate estimated
| tax for a user based on gives info
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.calculateEstimatedTax = (req, res) => {
	vehicles
		.findOne({ whos: req.params.userId })
		.exec((err, vehicle) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
			}
			else if (!vehicle) {
				sendJsonResponse(res, 404, {
					error: 'no vehicle found for tax calculation',
				});
			}
			else {
				const vehicleStatus = vehicle.car_status;
				let totalIncomeForTax = 0;
				let totalExpenseForTax = 0;

				const getTotalIncome = () => {
					return new Promise((resolve, reject) => {
						incomes
							.find({whos: req.params.userId })
							.select('income')
							.exec((err, incomes) => {
								if (err) {
									reject(err);
								}
								else {
									totalIncomeForTax = incomes.reduce((sum, income) => {
										return sum + income.income;
									},0);
									resolve(totalIncomeForTax);
								}
							})
					})
				};

				const totalExpense = () => {
					return new Promise((resolve, reject) => {
						expenses
							.find({ whos: req.params.userId })
							.select('amount')
							.exec((err, expenses) => {
								if (err) {
									reject(err);
								}
								else {
									totalExpenseForTax = expenses.reduce((sum, expense) => {
										return sum + expense.amount;
									},0);
									resolve(totalExpenseForTax);
								}
							})
					})
				};

				
				// get all income and expenses.
				Promise.all([totalExpense(), getTotalIncome()])
					.then((responses) => {
						let taxPayable = 0;
						let grossIncome = 0;
						let percentageAdjustment = 0.1;
						
						if (vehicleStatus === 'finance' || vehicleStatus === 'own') {
							let totalTaxAmount = 0;
							taxPayable = (responses[1] * process.env.NI_CONTRIBUTON) + (responses[1] * percentageAdjustment);
							grossIncome = parseFloat(responses[1] - responses[0]);

							if (grossIncome > process.env.TAXFREE_INCOME) {
								let netDifference = parseFloat(grossIncome - process.env.TAXFREE_INCOME);
								if (netDifference > 0) {
									totalTaxAmount = parseFloat(netDifference * 0.20);
								}
								else {
									totalTaxAmount = 0;
								}
							}
							sendJsonResponse(res, 200, {
								ni: process.env.NI_CONTRIBUTON,
								percentageAdjustment: percentageAdjustment,
								taxPayable: taxPayable,
								grossIncome: grossIncome,
								totalTaxAmount: totalTaxAmount,
							});
						}
						else if (vehicleStatus === 'rented') {
							let taxPayable = 0;
							let percentageAdjustment = 0;
							let totalTaxAmount = 0;
							grossIncome = parseFloat(responses[1] - responses[0]);
							taxPayable = (req.params.totalIncome * process.env.NI_CONTRIBUTON) + (req.params.totalIncome * percentageAdjustment);
							if (grossIncome > process.env.TAXFREE_INCOME) {
								let netDifference = parseFloat(grossIncome - process.env.TAXFREE_INCOME);

								if (netDifference > 0) {
									totalTaxAmount = parseFloat(netDifference * 0.20);
								}
								else {
									totalTaxAmount = 0;
								}
							}
							sendJsonResponse(res, 200, {
								ni: process.env.NI_CONTRIBUTON,
								percentageAdjustment: percentageAdjustment,
								taxPayable: taxPayable,
								totalTaxAmount: totalTaxAmount,
							});
						}

					})
					.catch((err) => {
						sendJsonResponse(res, 404, {
							error: err,
						});
					})
			}
		})
}

/*
|----------------------------------------------
| Following function will delete income based on
| given userId and incomeId
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.deleteIncome = function (req, res) {
	const incomeDelObject = Joi.object().keys({
		userId: Joi.string().email().min(3).required(),
		incomeId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/),
	});

	Joi.validate(req.params, incomeDelObject, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message
			});
			return;
		}
		else {
			incomes
				.findOneAndRemove({whos: req.params.userId, _id: req.params.incomeId})
				.exec((err, income) => {
					if (err) {
						sendJsonResponse(res, 404, {
			 				error: err,
			 			});
			 			return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							data: 'income successfully deleted',
						});
					}
				})
		}
	});
}


/*
|----------------------------------------------
| Following method will show single income statement
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showSingleIncome = function (req, res) {
	const incomeEditObject = Joi.object().keys({
		userId: Joi.string().email().min(3).required(),
		incomeId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/),
	});

	Joi.validate(req.params, incomeEditObject, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			incomes
				.find({whos: req.params.userId, _id: req.params.incomeId})
				.exec((err, income) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else {
						// checking whether this user has any income.
						if (income.length > 0) {
							sendJsonResponse(res, 200, {
		 						success: true,
		 						data: income,
		 					});
						}
						else{
							sendJsonResponse(res, 404, {
								error: `Error! No income found with ${req.params.userId} user email`,
							});
							return;
						}
					}
				})
		}
	})
}

/*
|----------------------------------------------
| Following method will update sinlge income
| based on given id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.updateIncome = function (req, res) {
	const updateIncomeObject = Joi.object().keys({
		userId: Joi.string().email().min(3).required(),
		incomeId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/),
	});

	Joi.validate(req.params, updateIncomeObject, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			incomes
				.update({whos: req.params.userId, _id: req.params.incomeId}, {
					income: req.body.amount,
					incomeType: req.body.income_source,
					incomeDate: req.body.incomeDate, 
				}, (err) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: `Error! while updating income.`
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
						});
					}
				})
		}
	})
}

/*
|----------------------------------------------
| following function will add contact details
| based on given user email			
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addContact = (req, res) => {	
	const userId = Joi.object().keys({
		userId: Joi.string().email().required(),
	});
	// 07476641288
	const basicContact = Joi.object().keys({
		house: Joi.string().min(1).max(4).regex(/^[0-9]{1,4}$/).required(),
		street: Joi.string().min(3).max(20).regex(/^[a-zA-Z ]{3,20}$/).required(),
		city: Joi.string().min(3).max(20).regex(/^[a-zA-Z ]{3,20}$/).required(),
		county: Joi.string().min(3).max(20).regex(/^[a-zA-Z ]{3,20}$/).required(),
		postcode: Joi.string().min(3).max(8).regex(/^[a-zA-Z0-9 ]{5,8}$/).required(),
		mobile: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/).required(),
		Landphone: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/).allow(''),
		business: Joi.boolean(),
	});
	const businessContact = Joi.object().keys({
		building: Joi.string().min(1).max(4).regex(/^[0-9]{1,4}$/).required(),
		street: Joi.string().min(3).max(20).regex(/^[a-zA-Z ]{3,20}$/).required(),
		city: Joi.string().min(3).max(20).regex(/^[a-zA-Z ]{3,20}$/).required(),
		county: Joi.string().min(3).max(20).regex(/^[a-zA-Z ]{3,20}$/).required(),
		postcode: Joi.string().min(3).max(8).regex(/^[a-zA-Z0-9 ]{5,8}$/).required(),
		landphone: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/).allow(''),
		mobile: Joi.string().min(11).max(11).regex(/^[0-9]{11,11}$/).required(),
		email: Joi.string().email().allow(''),
	});	

	// validate user id.
	Joi.validate(req.params, userId, (err,  value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			// when basic address is business address as well. 
			if (req.body.business === true) {
				Joi.validate(req.body.basic, basicContact, (err, value) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err.details[0].message,
						});
						return;
					}
					else {
						const contact = new contacts();
						contact.contactId = uId(10);
						contact.whos = req.params.userId;
						contact.house_no = req.body.basic.house;
						contact.street_name = req.body.basic.street;
						contact.city = req.body.basic.city;
						contact.county = req.body.basic.county;
						contact.postcode = req.body.basic.postcode;
						contact.mobile = req.body.basic.mobile;
						contact.landLine = req.body.basic.landphone;

						// now save the contact
						contact.save((err, contact) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							else {
								sendJsonResponse(res, 200, {
									success: true,
									data: contact,
								});
							}
						})
					}
				});
			}
			else if (req.body.business === false) {
				Joi.validate(req.body.basic, basicContact, (err, value) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err.details[0].message,
						});
						return;
					}
					else {
						// validate business contact.
						Joi.validate(req.body.businessadd, businessContact, (err, value) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err.details[0].message,
								});
								return;
							}
							else {
								const contact = new contacts();
								contact.contactId = uId(10);
								contact.whos = req.params.userId;
								contact.house_no = req.body.basic.house;
								contact.street_name = req.body.basic.street;
								contact.city = req.body.basic.city;
								contact.county = req.body.basic.county;
								contact.postcode = req.body.basic.postcode;
								contact.mobile = req.body.basic.mobile;
								contact.landLine = req.body.basic.landLine;
								contact.businessContact = false;

								contact.save((err, contact) => {
									if (err) {
										sendJsonResponse(res, 404, {
											error: err,
										});
										return;
									}
									else {
										contacts 
											.findOne({whos: req.params.userId})
											.select('businessAddress')
											.exec((err, contact) => {
												if (err) {
													sendJsonResponse(res, 404, {
														error: err,
													});
													return;
												}												
												else if (!contact) {
													sendJsonResponse(res, 404, {
														error: `Error! while adding business contact to the database. contact admin`,
													});
													return;
												}
												else {
													contact.businessAddress.push({
														house_no: req.body.businessadd.building,
														street_name: req.body.businessadd.street,
														city: req.body.businessadd.city,
														county: req.body.businessadd.county,
														postcode: req.body.businessadd.postcode,
														mobile: req.body.businessadd.mobile,
														landLine: req.body.businessadd.landphone,
														email: req.body.businessadd.email,
													});
													contact.save((err, contact) => {
														if (err) {
															sendJsonResponse(res, 404, {
																error: err,
															});
															return;
														}
														else {
															sendJsonResponse(res, 200, {
																success: true,
																data: contact,
															});
														}
													});
												}												
											});
									}
								});
							}
						});
					}
				});
			}
		}
	});
}


/*
|----------------------------------------------
| Following method will show user contact 
| based on user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showContact = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			// find contact based on given user id
			contacts
				.findOne({whos: req.params.userId})
				.exec((err, contact) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!contact) {
						sendJsonResponse(res, 404, {
							error: `No contact has been found for ${req.params.userId}`,
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							data: contact,
						})
					}
				});
		}
	})
}


/*
|----------------------------------------------
| Following function will add  business info
| according to given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addBusinessInfo = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
		}
		else {		
					
			// to validate form data.
			const businessInfo = Joi.object().keys({
				name: Joi.string().min(3).max(25).required(),
				type: Joi.string().min(3).max(25).required(),
			});

			// checking validation.
			Joi.validate(req.body, businessInfo, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else{

					const business = new Business();

					business.businessId = uId(10);
					business.whos = req.params.userId;
					business.businessName = req.body.name;
					business.businessType = req.body.type;

					// now saving changes
					business.save((err, bus) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: 'Error! while saving',
							});
							return;
						}
						else{
							sendJsonResponse(res, 200, {
								success: true,
								data: bus
							});
						}
					})
				}
			})
				
		}
	});
}

/*
|----------------------------------------------
| Following function will show basic business info
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showBusinessInfo = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			Business
				.findOne({whos: req.params.userId})
				.exec((err, business) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!business) {
						sendJsonResponse(res, 404, {
							error: 'No business profile found for this user',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						data: business,
					});
				})
		}
	})
}

/*
|----------------------------------------------
| Following function will add vehicle to user
| according to userid
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addVehicle = (req, res) => {
	Joi.validate(req.userId, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			const vehicle = Joi.object().keys({
				type: Joi.string().min(3).required(),
				brand: Joi.string().min(3).required(),
				registration: Joi.string().min(5).required(),
				car_value: Joi.number().min(3).required(),
				mot: Joi.required(),
				roadtax: Joi.required(),
				car_status: Joi.string().min(3).required(),
			});

			// validate form data.
			Joi.validate(req.body, vehicle, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err.details[0].message,
					})
					return;
				}
				else{
					const uservehicle = new vehicles();
					uservehicle.settingId = uId(10);
					uservehicle.whos = req.params.userId;
					uservehicle.car_type =  req.body.type;
					uservehicle.brand = req.body.brand;
					uservehicle.rg_number = req.body.registration;
					uservehicle.car_value = req.body.car_value;
					uservehicle.mot = req.body.mot;
					uservehicle.road_tax = req.body.roadtax;
					uservehicle.car_status = req.body.car_status;

					// save the vehicle.
					uservehicle.save((err) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
							return;
						}
						else {
							sendJsonResponse(res, 200, {
								success: true,
								data: uservehicle,
							});
						}
					});
				}
			})
		}
	});
}


/*
|----------------------------------------------
| following function will show vehicle details
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showVehicle = (req, res) => {
	Joi.validate(req.userId, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else{
			vehicles
				.findOne({whos: req.params.userId})
				.exec((err, vehicle) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!vehicle) {
						sendJsonResponse(res, 404, {
							error: 'vehicle not found',
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							data: vehicle,
						});
					}
				})
		}
	});
}

/*
|----------------------------------------------
| Following method will add insurance details 
| for the given user based on given id.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addInsurance = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			const insurance = Joi.object().keys({
				name: Joi.string().min(3).required(),
				valid_date: Joi.string().required(),
				number: Joi.string().min(3),
			});

			Joi.validate(req.body, insurance, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else{
					const insurance = new Insurance();

					insurance.insuranceId = uId(10);
					insurance.whos = req.params.userId;
					insurance.provider_name = req.body.name;
					insurance.valid_till = req.body.valid_date;
					insurance.insurance_number = req.body.number;

					insurance.save(err => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
						}
						else {
							sendJsonResponse(res, 200, {
								success: true,
							});
						}
					})
				}
			})
		}
	})
}

/*
|----------------------------------------------
| Following method will show insurance details 
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showInsurance = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			Insurance
				.findOne({whos: req.params.userId})
				.exec((err, insurance) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!insurance) {
						sendJsonResponse(res, 404, {
							error: 'No insurance found for given user email',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						insurance: insurance,
					});
				})
		}
	});
}

/*
|----------------------------------------------
| Following function will add lisence information
| to user collection based on given id.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addLisence = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else {
			const lisence = Joi.object().keys({
				dvla: Joi.string().min(5).max(16).regex(/^[a-zA-Z0-9]{5,16}$/).required(),
				taxi_type: Joi.string().max(32).required(),
				valid_till: Joi.string().required(),
			});

			Joi.validate(req.body, lisence, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else{
					const lisence = new Lisence();

					lisence.lisenceId = uId(10);
					lisence.whos = req.params.userId;
					lisence.dvla = req.body.dvla;
					lisence.taxi_type = req.body.taxi_type;
					lisence.valid_till = req.body.valid_till;

					// save the license.
					lisence.save(err => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
						}
						else {
							sendJsonResponse(res, 200, {
								success: true,
								lisence: lisence,
							});
						}
					})

				}
			})
		}
	})
}


/*
|----------------------------------------------
| following method will get user lisence info
| based on given userid
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/

module.exports.showLisence = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else {
			Lisence
				.findOne({ whos: req.params.userId })
				.exec((err, lisence) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					else if (!lisence) {
						sendJsonResponse(res, 404, {
							error: 'No lisence has been found for given your id',
						});
						return;
					}
					else {
						sendJsonResponse(res, 200, {
							success: true,
							lisence: lisence,
						})
					}
				});
		}
	});
}




