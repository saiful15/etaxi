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
			vehicles 		=		mongoose.model('vehicles'),
			incomes 			=		mongoose.model('incomes');


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
module.exports.saveAdditionInfo 		=		function(req, res){
	if(!req.params && !req.params.userId){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else {
		if(!req.body.ni_number || !req.body.uti_number){
			sendJsonResponse(res, 404, {
				error: "All fields are required. Must not be empty"
			});
		}
		else{
			users
				.findById({_id: req.params.userId})
				.select('additional_info')
				.exec(function(err, user){
					if(!user){
						sendJsonResponse(res, 404, {
							error: "No user found with given user id"
						});
						return;
					}
					else if(err){
						sendJsonResponse(res, 404, {
							error: err
						});
						return;
					}
					else{
						user.additional_info.push({
							ni_number: req.body.ni_number,
							uti_number: req.body.uti_number,
							created_at: Date.now()
						});

						// saving this new info.
						user.save(function(err, user){
							if(err){
								sendJsonResponse(res, 404, {
									error: err
								});
								return;
							}
							else {
								sendJsonResponse(res, 200, {
									additionalInfo: user.additional_info
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
			users
				.findOne({email: req.params.userId})
				.select('business')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'no user found',
						});
						return;
					}
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
							user.business.push({
								name: req.body.name,
								type: req.body.type,
							});

							// now saving changes
							user.save((err, user) => {
								if (err) {
									sendJsonResponse(res, 404, {
										error: 'Error! while saving',
									});
									return;
								}
								else{
									sendJsonResponse(res, 200, {
										success: true,
										data: user.business,
									});
								}
							})
						}
					})
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
			users
				.findOne({email: req.params.userId})
				.select('business')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'user not found',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						data: user.business,
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
				valid_date: Joi.date().iso().required(),
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
					users 
						.findOne({email: req.params.userId})
						.select('insurance')
						.exec((err, user) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							if (!user) {
								sendJsonResponse(res, 404, {
									error: 'No user has been found according to given id',
								});
								return;
							}
							user.insurance.push({
								provider_name: req.body.name,
								valid_till: req.body.valid_date,
								insurance_number: req.body.number,
							});

							user.save((err, user) => {
								if (err) {
									sendJsonResponse(res, 404, {
										error: 'Error! while saving the insurance info',
									});
									return;
								}
								else{
									sendJsonResponse(res, 200, {
										success: true,
										data: user.insurance,
									});
								}
							})
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
			users
				.findOne({email: req.params.userId})
				.select('insurance')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'No user found for given user email',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						insurance: user.insurance,
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
				dvla: Joi.string().min(5).max(16).regex(/^[0-9]{5,16}$/).required(),
				taxi_type: Joi.string().max(32).required(),
				valid_till: Joi.date().required(),
			});

			Joi.validate(req.body, lisence, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else{
					users
						.findOne({email: req.params.userId})
						.select('lisence')
						.exec((err, user) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							if (!user) {
								sendJsonResponse(res, 404, {
									error: 'no user found',
								});
								return;
							}
							else {
								user.lisence.push({
									dvla: req.body.dvla,
									taxi: req.body.taxi_type,
									valid_till: req.body.valid_till,
								});

								user.save((err, user) => {
									if (err) {
										sendJsonResponse(res, 404, {
											error: 'Error! while saving lisence information',
										});
										return;
									}
									else{
										sendJsonResponse(res, 200, {
											success: true,
											lisence: user.lisence,
										});
									}
								})

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
			users
				.findOne({email: req.params.userId})
				.select('lisence')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: `No user found with given user name`,
						});
						return;
					}
					else {
						return sendJsonResponse(res, 200, {
							lisence: user.lisence,
						});
					}
				})
		}
	});
}




